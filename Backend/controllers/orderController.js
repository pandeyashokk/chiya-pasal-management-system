const Order = require("../models/Order");
const Table = require("../models/Table");
const Menu = require("../models/Menu");
const { generateOrderId } = require("../utils/generateOrderId");

const placeOrder = async (req, res, next) => {
  try {
    const { tableId, items, specialInstructions } = req.body;

    //validate if table exists
    const table = await Table.findOne({ tableId });
    if (!table) {
      res.code = 400;
      throw new Error("Invalid Table");
    }
    if (!items || items.length === 0) {
      res.code = 400;
      throw new Error("Order must have at least one item");
    }
    let totalAmount = 0;
    const processedItems = [];

    //validate each item + calculate total
    for (let item of items) {
      const isItem = await Menu.findOne({ itemId: item.itemId });
      if (!isItem) {
        res.code = 400;
        throw new Error(`Item ${item.itemId} not found in menu`);
      }
      if (isItem.stock < item.quantity) {
        res.code = 400;
        throw new Error(`${isItem.name} only has ${isItem.stock} in stock`);
      }
      totalAmount += isItem.price * item.quantity;

      processedItems.push({
        itemId: isItem.itemId,
        name: isItem.name,
        price: isItem.price,
        quantity: item.quantity,
      });

      //reduce stock
      isItem.stock -= item.quantity;
      await isItem.save();
    }

    const orderId = await generateOrderId();

    const order = await Order.create({
      orderId,
      tableId,
      items: processedItems,
      specialInstructions,
      totalAmount,
    });
    const io = req.app.get("io");
    io.to("kitchen").emit("newOrder", order);
    io.to("admin").emit("newOrder", order);

    res.status(201).json({
      code: 201,
      status: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingOrders = async (req, res, next) => {
  try {
    // const status = req.query.status || "Pending";
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Orders fetched Successfully!",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

const deletePaidOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, status: "Paid" });

    if (!order) {
      res.code = 404;
      throw new Error("Paid order not found");
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Successfully deleted paid order",
      data: {
        deletedOrderId: order.orderId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      res.code = 404;
      throw new Error("Order not Found");
    }

    const validTransitions = {
      Pending: ["Preparing"],
      Preparing: ["Ready"],
      Ready: ["Served"],
      Served: ["Paid"],
      Paid: [],
    };

    const allowedRoles = {
      Preparing: ["kitchen", "admin"],
      Ready: ["kitchen", "admin"],
      Served: ["waiter", "admin"],
      Paid: ["admin"],
    };

    // Check if transition is valid
    if (!validTransitions[order.status].includes(status)) {
      res.code = 400;
      throw new Error(`Cannot change from ${order.status} → ${status}`);
    }

    // Check role permission
    if (!allowedRoles[status].includes(req.user.role)) {
      res.code = 403;
      throw new Error("You are not allowed to perform this action");
    }

    order.status = status;
    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user.role,
    });

    await order.save();

    const io = req.app.get("io");

    // Notify kitchen & admin
    if (["Preparing", "Ready"].includes(status)) {
      io.to("kitchen").emit("orderUpdate", order);
      io.to("admin").emit("orderUpdate", order);
    }

    // Notify waiter
    if (status === "Ready") {
      io.to("waiter").emit("orderReady", order);
      io.to("admin").emit("orderReady", order);
    }

    if (status === "Served") {
      io.to("kitchen").emit("orderUpdate", order);
      io.to("admin").emit("orderUpdate", order);
    }

    // Notify customer table
    if (["Preparing", "Ready", "Served", "Paid"].includes(status)) {
      io.to(`table-${order.tableId}`).emit("statusUpdate", {
        orderId: order.orderId,
        status: order.status,
        message: `Your order is now ${status}!`,
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: `Order is now ${status}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// pending orders only seen for kitchen and admin
const getKitchenOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: { $in: ["Pending", "Preparing"] },
    }).sort({ createdAt: -1 });

    //KOT
    const kotData = orders.map((order) => ({
      objectId: order._id,
      orderId: order.orderId,
      tableId: order.tableId,
      items: order.items.map((item) => `${item.name} ------${item.quantity}`),
      specialInstructions: order.specialInstructions || "None",
      status: order.status,
      timeSinceOrder:
        Math.floor((Date.now() - order.createdAt) / 60000) + "min ago",
    }));

    res.status(200).json({
      code: 200,
      status: true,
      message: "Kitchen Order Fetched Successfully.",
      data: { count: orders.length, kotData },
    });
  } catch (error) {
    next(error);
  }
};

//pending order only seen for waiter and admin
const getWaiterOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      status: "Ready",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Waiter Order Fetched Successfully",
      data: { count: orders.length, orders },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getPendingOrders,
  updateOrderStatus,
  deletePaidOrder,
  getKitchenOrders,
  getWaiterOrders,
};
