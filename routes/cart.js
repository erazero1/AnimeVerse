const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middlewares/auth');

// Create a new cart for the authenticated user
router.post("/", authenticateUser, cartController.createCart);

// Alternatively, you can use req.user._id if your authentication middleware attaches the user.
router.get("/:userId", authenticateUser, cartController.getCartByUser);

// Update a cart by its ID
router.put("/:id", authenticateUser, cartController.updateCart);

module.exports = router;
