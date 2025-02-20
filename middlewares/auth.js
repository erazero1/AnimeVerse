// middlewares/auth.js
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "secretkey";

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Expecting format: Bearer <token>
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
