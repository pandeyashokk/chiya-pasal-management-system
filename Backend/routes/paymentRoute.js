const express = require("express");
const router = express.Router();

const {
  initiateKhalti,
  khaltiCallback,
} = require("../controllers/paymentController");

router.post("/khalti/initiate", initiateKhalti);
router.get("/khalti/callback", khaltiCallback);

module.exports = router;
