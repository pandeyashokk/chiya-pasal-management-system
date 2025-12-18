const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [1, "Price must be greater than 0 "],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 100,
    },
    category: {
      type: String,
      required: true,
      enum: ["Tea", "Coffee", "Snacks", "Drinks", "Desserts", "Others"],
      default: "Others",
    },
  },
  {
    timestamps: true,
  }
);

const Menu = mongoose.model("menu", MenuSchema);
module.exports = Menu;
