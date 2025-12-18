const Menu = require("../models/Menu");

const generateItemId = async () => {
  const lastItem = await Menu.findOne().sort({ createdAt: -1 });
  if (!lastItem) {
    return "M101";
  }
  const lastNumber = parseInt(lastItem.itemId.replace("M", "")) || 100;
  return `M${lastNumber + 1}`;
};

module.exports = { generateItemId };
