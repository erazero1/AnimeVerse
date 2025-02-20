const Anime = require("../models/Anime");

// Create a new anime
exports.createAnime = async (req, res) => {
  const { name, price, description, category, stockQuantity, images } = req.body;
  try {
    const anime = new Anime({ name, price, description, category, stockQuantity, images });
    await anime.save();
    res.status(201).json({ message: "Anime created successfully", anime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all anime
exports.getAnimes = async (req, res) => {
  try {
    const animes = await Anime.find();
    res.status(200).json({ animes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a single anime by ID
exports.getAnimeById = async (req, res) => {
  try {
    const anime = await Anime.findById(req.params.id);
    if (!anime) return res.status(404).json({ error: "Anime not found" });
    res.status(200).json({ anime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an anime by ID
exports.updateAnime = async (req, res) => {
  try {
    const updatedAnime = await Anime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedAnime) return res.status(404).json({ error: "Anime not found" });
    res.status(200).json({ message: "Anime updated successfully", anime: updatedAnime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an anime by ID
exports.deleteAnime = async (req, res) => {
  try {
    const deletedAnime = await Anime.findByIdAndDelete(req.params.id);
    if (!deletedAnime) return res.status(404).json({ error: "Anime not found" });
    res.status(200).json({ message: "Anime deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
