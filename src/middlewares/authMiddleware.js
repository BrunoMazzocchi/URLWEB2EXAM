const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const mysqlClient = require("../config/db/databaseConnection");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;

    // Check if token exists in the database blacklist
    const query = `SELECT * FROM expired_token WHERE token = '${token}'`;

    const result = await new Promise((resolve, reject) => {
      mysqlClient.query(query, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    if (result.length > 0) {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
