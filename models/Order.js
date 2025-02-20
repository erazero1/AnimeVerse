const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    animes: [
      {
        anime: { type: mongoose.Schema.Types.ObjectId, ref: "Anime", required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    totalCost: { type: Number, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
