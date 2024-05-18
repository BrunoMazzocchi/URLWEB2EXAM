const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const logger = require("../../logger");

const postMiddleware = (req, res, next) => {
  const token = req.headers.authorization || req.query.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      const userId = decoded.userId;
      req.userId = userId;
    } catch (error) {
      logger.error("Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  next();
};

module.exports = postMiddleware;
