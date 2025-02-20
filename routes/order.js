const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/auth");

// Create a new order (checkout)
router.post("/", authMiddleware, orderController.createOrder);

// Get all orders (admin view or user order history)
router.get("/", authMiddleware, orderController.getOrders);

// Get a specific order by ID
router.get("/:id", authMiddleware, orderController.getOrderById);

// Update order status (admin)
router.put("/:id", authMiddleware, orderController.updateOrderStatus);

module.exports = router;
