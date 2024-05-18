const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const mysqlClient = require("../config/db/databaseConnection");
const logger = require("../../logger");

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    logger.info("Unauthorized");
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validates that the token is not expired
    if (decoded.exp <= Date.now() / 1000) {
      logger.info("Invalid token");
      return res.status(401).json({ message: "Token expired" });
    }

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
      logger.info("Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  } catch (error) {
    logger.error("Invalid token: " + error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
