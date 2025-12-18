const axios = require("axios");
const Payment = require("../models/Payment");
const Order = require("../models/Order");

const {
  khaltiReturnUrl,
  khaltiSecretKey,
  khaltiFailureUrl,
} = require("../config/keys");

// SANDBOX (TEST) URLs — SAFE, NO REAL MONEY
const INITIATE_URL = "https://a.khalti.com/api/v2/epayment/initiate/";
const LOOKUP_URL = "https://a.khalti.com/api/v2/epayment/lookup/";

//khalti initiate(called after order served)
const initiateKhalti = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.code = 404;
      throw new Error("Order not found");
    }
    if (order.status === "Paid") {
      res.code = 400;
      throw new Error("Already paid");
    }
    if (order.status !== "Served") {
      res.code = 400;
      throw new Error("Order must be served before payment");
    }

    const payload = {
      return_url: khaltiReturnUrl,
      website_url: "http://localhost:5173", //our website url
      amount: order.totalAmount * 100, // in paisa
      purchase_order_id: order.orderId,
      purchase_order_name: `Chiya Pasal Order ${order.orderId}`,
      customer_info: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "9800000000",
      },
    };

    const response = await axios.post(INITIATE_URL, payload, {
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    //save pending payment
    await Payment.findOneAndUpdate(
      { orderId: order._id },
      {
        method: "khalti",
        amount: order.totalAmount,
        status: "Pending",
        gatewayTransactionId: response.data.pidx,
      },
      { upsert: true }
    );

    res.json({
      code: 200,
      success: true,
      message: "Redirect to Khalti (TEST MODE - No real charge)",
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    next(error);
  }
};

const khaltiCallback = async (req, res, next) => {
  try {
    const { pidx, status } = req.query;

    if (status !== "Completed") {
      // return res.redirect(khaltiFailureUrl);
      res.code = 400;
      throw new Error("Status is not completed");
    }

    const verify = await axios.post(
      LOOKUP_URL,
      { pidx },
      {
        headers: { Authorization: `Key ${khaltiSecretKey}` },
      }
    );

    if (verify.data.status !== "Completed") {
      // return res.redirect(khaltiFailureUrl);
      res.code = 400;
      throw new Error("Payment verification failed with khalti");
    }

    //find payment
    const payment = await Payment.findOne({ gatewayTransactionId: pidx });
    if (!payment) {
      // return res.redirect(khaltiFailureUrl);
      res.code = 400;
      throw new Error("Payment not Found");
    }

    //prevent double payment
    if (payment.status === "Paid") {
      // return res.redirect(`${khaltiReturnUrl}?success=true&already_paid=true`);
      res.code = 200;
      throw new Error("Payment is already marked as Paid");
    }

    payment.status = "Paid";
    await payment.save();

    //update order to paid
    const order = await Order.findByIdAndUpdate(
      payment.orderId,
      { status: "Paid" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found after payment update",
      });
    }

    //emit to customer
    const io = req.app.get("io");
    if (io && order) {
      io.to(`table-${order.tableId}`).emit("statusUpdate", {
        orderId: order.orderId,
        status: "Paid",
        message: "Payment successful!",
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully! Order marked as Paid.",
      data: {
        pidx,
        orderId: order.orderId,
        tableId: order.tableId,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    // res.redirect(khaltiFailureUrl);
    next(error);
  }
};

module.exports = { initiateKhalti, khaltiCallback };
