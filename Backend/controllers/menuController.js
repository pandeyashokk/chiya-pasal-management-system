const Menu = require("../models/Menu");
const { generateItemId } = require("../utils/generateItemId");

const getMenu = async (req, res, next) => {
  try {
    const menu = await Menu.find().sort({ itemId: 1 });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Menu fetched successfully",
      data: menu,
    });
  } catch (error) {
    next(error);
  }
};

const createMenuItem = async (req, res, next) => {
  try {
    const { name, price, stock, category } = req.body;

    if (!name || !price || !category) {
      res.code = 400;
      throw new Error("Name, Price and Category are required");
    }

    const isItem = await Menu.findOne({ name });
    if (isItem) {
      res.code = 400;
      throw new Error("Item already exists!");
    }

    const itemId = await generateItemId();

    const menuItem = new Menu({ itemId, name, price, stock, category });
    await menuItem.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;

    const isMenu = await Menu.findById(id);

    if (!isMenu) {
      res.code = 404;
      throw new Error("Menu item not found");
    }

    isMenu.name = name || isMenu.name;
    if (price) isMenu.price = price;
    if (stock !== undefined) isMenu.stock = stock;
    isMenu.category = category || isMenu.category;

    await isMenu.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Menu item updated successfully",
      data: isMenu,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findByIdAndDelete(id);

    if (!menu) {
      res.code = 404;
      throw new Error("Menu item not found");
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getMenu, createMenuItem, updateMenuItem, deleteMenuItem };
