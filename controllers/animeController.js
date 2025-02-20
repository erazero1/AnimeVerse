const Anime = require("../models/Anime");
const User = require("../models/User");

// Admin: Create anime
exports.createAnime = async (req, res) => {
  try {
    const anime = new Anime(req.body);
    await anime.save();
    res.status(201).json({ message: "Anime added", anime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all animes (open for all users)
exports.getAnimes = async (req, res) => {
  try {
    const animes = await Anime.find();
    res.status(200).json({ animes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Delete anime
exports.deleteAnime = async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Anime deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// **Analytics Dashboard for Admins**
exports.getAnalytics = async (req, res) => {
  try {
    const totalSales = await User.aggregate([
      { $unwind: "$activityLogs" },
      { $match: { "activityLogs.action": "purchase" } },
      { $count: "totalSales" },
    ]);

    const mostViewedAnime = await User.aggregate([
      { $unwind: "$activityLogs" },
      { $match: { "activityLogs.action": "view" } },
      { $group: { _id: "$activityLogs.animeId", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      totalSales: totalSales[0]?.totalSales || 0,
      mostViewedAnime: mostViewedAnime[0] || "No data yet",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
