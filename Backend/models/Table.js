const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    tableId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    qrCodeURL: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Table = mongoose.model("table", TableSchema);
module.exports = Table;
