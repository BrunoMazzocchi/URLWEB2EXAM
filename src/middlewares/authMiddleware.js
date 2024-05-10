const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const mysqlClient = require("../config/db/databaseConnection");

async function authMiddleware(req, res, next) {
  const token = req.headers;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;

    const tokenExists = await mysqlClient.query(
      "SELECT * FROM expired_token WHERE token = ?",
      [token]
    );
    if (tokenExists.length > 0) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
