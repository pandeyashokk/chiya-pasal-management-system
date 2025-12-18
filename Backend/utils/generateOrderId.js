const Order = require("../models/Order");

const generateOrderId = async () => {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 });
  if (!lastOrder) return "ORD-001";

  const lastNumber = parseInt(lastOrder.orderId.split("-")[1]) || 0;
  return `ORD-${String(lastNumber + 1).padStart(3, "0")}`;
};

module.exports = { generateOrderId };
