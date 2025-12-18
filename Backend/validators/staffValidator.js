const { check } = require("express-validator");

const createStaffValidator = [
  check("name").notEmpty().withMessage("Name is required"),

  check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .notEmpty()
    .withMessage("Password is required"),

  check("role").notEmpty().withMessage("Role is required"),
];

module.exports = { createStaffValidator };
