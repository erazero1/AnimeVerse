const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticateUser } = require("../middlewares/auth");

// Create a new order (checkout)
router.post("/", authenticateUser, orderController.createOrder);

// Get all orders (admin view or user order history)
router.get("/", authenticateUser, orderController.getOrders);

// Get a specific order by ID
router.get("/:id", authenticateUser, orderController.getOrderById);

// Update order status (admin)
router.put("/:id", authenticateUser, orderController.updateOrderStatus);

module.exports = router;
