const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");

// Create a new anime
router.post("/", animeController.createAnime);

// Get all anime
router.get("/", animeController.getAnimes);

// Get an anime by ID
router.get("/:id", animeController.getAnimeById);

// Update an anime by ID
router.put("/:id", animeController.updateAnime);

// Delete an anime by ID
router.delete("/:id", animeController.deleteAnime);

module.exports = router;
