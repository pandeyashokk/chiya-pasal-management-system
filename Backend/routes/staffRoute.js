const express = require("express");
const router = express.Router();

const {
  getAllStaffs,
  deleteStaff,
  createStaff,
} = require("../controllers/staffController");

const { createStaffValidator } = require("../validators/staffValidator");
const validate = require("../validators/validate");

const rolesMiddleware = require("../middlewares/rolesMiddleware");
const isAuthorized = require("../middlewares/isAuth");

const adminOnly = rolesMiddleware("admin");

router.get("/", isAuthorized, adminOnly, getAllStaffs);
router.post(
  "/",
  isAuthorized,
  adminOnly,
  createStaffValidator,
  validate,
  createStaff
);
router.delete("/:id", isAuthorized, adminOnly, deleteStaff);

module.exports = router;
