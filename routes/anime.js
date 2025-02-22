const express = require("express");
const router = express.Router();
const animeController = require("../controllers/animeController");
const { authenticateUser, authorizeAdmin } = require("../middlewares/auth");

router.post("/", authenticateUser, authorizeAdmin, animeController.createAnime);
router.get("/", animeController.getAnimes);
router.get("/search", authenticateUser, animeController.getAnimeByTitle);
router.post("/filter", animeController.filterAnimes);
router.delete(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  animeController.deleteAnime
);
router.get(
  "/analytics",
  authenticateUser,
  authorizeAdmin,
  animeController.getAnalytics
);
router.put(
  "/:id",
  authenticateUser,
  authorizeAdmin,
  animeController.editAnimeById
);

module.exports = router;
