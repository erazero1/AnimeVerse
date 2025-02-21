require('dotenv').config({ path: './secrets.env' });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend files

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./routes/auth");
const animeRoutes = require("./routes/anime");
const orderRoutes = require("./routes/order");

app.use("/api/", authRoutes);
app.use("/api/animes", animeRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "index.html"))
});

app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "auth.html"))
});

app.get("/title", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "anime.html"));
})

app.get("/admin-panel", (req, res) => {
  res.sendFile(path.join(__dirname, "public/pages", "admin.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
