const express = require("express");
const { createOrder, getUserOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/createOrder", createOrder); // ✅ Create a new order
router.get("/:userId", getUserOrders); // ✅ Get all orders for a user
router.put("/:orderId/status", updateOrderStatus); // ✅ Update order status

module.exports = router;
