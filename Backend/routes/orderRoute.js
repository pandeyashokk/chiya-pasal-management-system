const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getPendingOrders,
  updateOrderStatus,
  deletePaidOrder,
  getKitchenOrders,
  getWaiterOrders,
} = require("../controllers/orderController");

const isAuthorized = require("../middlewares/isAuth");
const rolesMiddleware = require("../middlewares/rolesMiddleware");

const adminOnly = rolesMiddleware("admin");
const kitchenOnly = rolesMiddleware("kitchen");
const waiterOnly = rolesMiddleware("waiter");
const staffOnly = rolesMiddleware("admin", "kitchen", "waiter");

router.post("/", placeOrder);
router.get("/", isAuthorized, adminOnly, getPendingOrders);
router.put("/:id", isAuthorized, staffOnly, updateOrderStatus);
router.delete("/paid/:id", isAuthorized, adminOnly, deletePaidOrder);

//route for getting kitchen order
router.get("/kitchen", isAuthorized, kitchenOnly, getKitchenOrders);

//router for getting waiter order
router.get("/waiter", isAuthorized, waiterOnly, getWaiterOrders);

module.exports = router;
