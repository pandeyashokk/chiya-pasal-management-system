const Table = require("../models/Table");
const { generateQR } = require("../utils/generateQR");

const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableId: 1 });
    res.status(200).json({
      code: 200,
      status: true,
      message: "Tables fetched successfully",
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

const createTable = async (req, res, next) => {
  try {
    const { tableId } = req.body;
    if (!tableId) {
      res.code = 400;
      throw new Error("Table Id is required.");
    }
    const isTableExists = await Table.findOne({ tableId });
    if (isTableExists) {
      res.code = 400;
      throw new Error("Table already exists");
    }

    const qrCodeURL = generateQR(tableId);

    const newTable = new Table({ tableId, qrCodeURL });
    await newTable.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Table created successfully",
      data: newTable,
    });
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { tableId, status } = req.body;

    const isTable = await Table.findById(id);
    if (!isTable) {
      res.code = 404;
      throw new Error("Table not found");
    }

    //if admin change the tableId from T1 to T10
    if (tableId && tableId !== isTable.tableId) {
      //if T1o already exists
      const exists = await Table.findOne({ tableId });
      if (exists) {
        res.code = 400;
        throw new Error("This tableId already exists!");
      }
      isTable.qrCodeURL = generateQR(tableId);
    }
    isTable.tableId = tableId || isTable.tableId;
    isTable.status = status || isTable.status;

    await isTable.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Table updated successfully",
      data: isTable,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      res.code = 404;
      throw new Error("Table not found");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Table deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getTables, createTable, updateTable, deleteTable };
