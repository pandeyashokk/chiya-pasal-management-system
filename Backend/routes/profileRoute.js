const express = require("express");

const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/profileController");

const isAuthorized = require("../middlewares/isAuth");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

const adminOnly = rolesMiddleware("admin");

router.get("/", isAuthorized, getMyProfile);
router.put("/", isAuthorized, adminOnly, updateMyProfile);

module.exports = router;
