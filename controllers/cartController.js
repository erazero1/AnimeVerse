const Cart = require('../models/Cart');

exports.createCart = async (req, res) => {
  try {
    const {animes} = req.body;
    const user = req.user.id
    cart = new Cart({ user, animes });
    await cart.save();
    res.status(201).json({ message: "Cart created successfully", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCartByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user: userId, status: "Pending" }).populate('animes.anime');
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { animes } = req.body;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.animes = animes;
    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
