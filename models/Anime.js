const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    images: [String],
  },
  { timestamps: true }
);

// Create a text index for full-text search on name, description, and category.
animeSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Anime", animeSchema);
