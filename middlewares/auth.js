const jwt = require("jsonwebtoken");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), "secret");
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ error: "Forbidden: Admins only" });
  next();
};
