const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    cover: String,
    status: String,
    Type: String,
    Year: Number,
    Episodes: Number,
    Duration: Number,
    Studio: String,
    Genres: [String],
    Author: String,
    Score: Number,
    Rating: String,
    purchases: Number,
    price: Number,
    views: Number
  },
  { timestamps: true }
);


animeSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Anime", animeSchema);
