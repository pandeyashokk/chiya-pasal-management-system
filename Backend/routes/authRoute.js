const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const { signinValidator } = require("../validators/authValidator");

const validate = require("../validators/validate");

router.post("/login", signinValidator, validate, login);

module.exports = router;
