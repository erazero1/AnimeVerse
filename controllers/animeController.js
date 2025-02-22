const Anime = require("../models/Anime");
const User = require("../models/User");
const { logUserActivity } = require("../helpers/activityLogger");

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

// For searching an anime by title
exports.getAnimeByTitle = async (req, res) => {
  try {
    let title = req.query.title || "";
    // Remove any surrounding quotes if present
    title = title.replace(/^["']|["']$/g, "");
    const anime = await Anime.findOne({ title: new RegExp(`^${title}$`, "i") });
    if (!anime) {
      return res.status(404).json({ error: "Anime not found" });
    }
    if (req.user) {
      await logUserActivity(req.user.id, "view", anime._id);
      await logUserActivity(req.user.id, "search", anime._id);
    }
    res.status(200).json(anime);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// For retrieving a paginated list of animes
exports.getAnimes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skipCount = (page - 1) * limit;

    const totalCount = await Anime.countDocuments({});
    const totalPages = Math.ceil(totalCount / limit);

    const animes = await Anime.find().skip(skipCount).limit(limit);

    res.status(200).json({
      animes,
      totalPages,
      currentPage: page,
      totalCount,
    });
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

// controllers/animeController.js

exports.filterAnimes = async (req, res) => {
  try {
    const {
      status,
      type,
      myList,
      sorting,
      yearFrom,
      yearTo,
      episodes,
      duration,
      page,
      limit,
    } = req.body;

    // 1) Собираем query для фильтра (пример, как раньше)
    const query = {};

    if (Array.isArray(status) && status.length > 0) {
      query.status = { $in: status };
    }
    if (Array.isArray(type) && type.length > 0) {
      query.Type = { $in: type };
    }
    if (yearFrom && yearTo) {
      const from = parseInt(yearFrom, 10);
      const to = parseInt(yearTo, 10);
      if (!isNaN(from) && !isNaN(to)) {
        query.Year = { $gte: from, $lte: to };
      }
    }
    if (episodes) {
      const ep = parseInt(episodes, 10);
      if (!isNaN(ep)) {
        query.Episodes = { $gte: ep };
      }
    }
    if (duration) {
      const dur = parseInt(duration, 10);
      if (!isNaN(dur)) {
        query.Duration = { $gte: dur };
      }
    }

    // 2) Сортировка
    let sortObj = {};
    if (sorting === "rating") {
      sortObj.Score = -1;
    } else if (sorting === "date") {
      // сортируем по дате создания, можно и по году
      sortObj.createdAt = -1;
    }

    // 3) Пагинация (page, limit)
    const currentPage = parseInt(page, 10) || 1; // если не указано, страница = 1
    const perPage = parseInt(limit, 10) || 20; // если не указано, лимит = 20

    const skipCount = (currentPage - 1) * perPage;

    // 4) Считаем общее кол-во для totalPages
    const totalCount = await Anime.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);

    // 5) Достаём нужную страницу
    const animes = await Anime.find(query)
      .sort(sortObj)
      .skip(skipCount)
      .limit(perPage);

    // 6) Возвращаем массив и метаданные пагинации
    res.status(200).json({
      animes,
      totalPages,
      currentPage,
      totalCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editAnimeById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAnime = await Anime.findByIdAndUpdate(id, req.body, {
      new: true,
      overwrite: true,
      runValidators: true,
    });
    if (!updatedAnime) {
      return res.status(404).json({ error: "Anime not found" });
    }
    res
      .status(200)
      .json({ message: "Anime updated successfully", anime: updatedAnime });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
