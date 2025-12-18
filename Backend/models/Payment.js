const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, //one payment per order
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["cash", "khalti"], // online for future
      default: "cash",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    gatewayTransactionId: { type: String }, // Khalti pidx
    gatewayResponse: { type: Object },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("payment", PaymentSchema);
module.exports = Payment;
