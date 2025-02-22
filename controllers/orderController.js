const Order = require("../models/Order");
const Anime = require("../models/Anime");

// Create a new order (checkout)
exports.createOrder = async (req, res) => {
  const { user, animes } = req.body;
  try {
    // Try to find an existing order for this user.
    let order = await Order.findOne({ user: user });
    
    // Calculate the additional cost for the new anime items
    let additionalCost = 0;
    for (let item of animes) {
      const anime = await Anime.findById(item.anime);
      if (!anime) return res.status(404).json({ error: "Anime not found" });
      additionalCost += anime.price * (item.quantity || 1);
    }
    
    if (order) {
      // If order exists, push new anime items.
      // You could also check if an item already exists in the order and update its quantity.
      order.animes = order.animes.concat(animes);
      order.totalCost = order.totalCost + additionalCost;
      
      await order.save();
      res.status(200).json({ message: "Order updated successfully", order });
    } else {
      // If no order exists for the user, create a new order.
      order = new Order({ user, animes, totalCost: additionalCost });
      await order.save();
      res.status(201).json({ message: "Order created successfully", order });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Retrieve all orders (for admin or user order history)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("animes.anime", "name price");
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("animes.anime", "name price");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (e.g., from Pending to Shipped)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
