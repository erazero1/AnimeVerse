const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  animes: [
    {
      anime: { type: mongoose.Schema.Types.ObjectId, ref: "Anime", required: true },
      // Optionally, include a quantity field if needed:
      quantity: { type: Number, default: 1 }
    }
  ],
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
