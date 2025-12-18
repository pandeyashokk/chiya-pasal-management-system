const express = require("express");
const router = express.Router();

const {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} = require("../controllers/tableController");

const isAuthorized = require("../middlewares/isAuth");
const authorizedRoles = require("../middlewares/rolesMiddleware");

const adminOnly = authorizedRoles("admin");

router.get("/", isAuthorized, adminOnly, getTables);
router.post("/", isAuthorized, adminOnly, createTable);
router.put("/:id", isAuthorized, adminOnly, updateTable);
router.delete("/:id", isAuthorized, adminOnly, deleteTable);

module.exports = router;
