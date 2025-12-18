const express = require("express");
const router = express.Router();

const {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const isAuthorized = require("../middlewares/isAuth");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

const adminOnly = rolesMiddleware("admin");

router.get("/", getMenu);
router.post("/", isAuthorized, adminOnly, createMenuItem);
router.put("/:id", isAuthorized, adminOnly, updateMenuItem);
router.delete("/:id", isAuthorized, adminOnly, deleteMenuItem);

module.exports = router;
