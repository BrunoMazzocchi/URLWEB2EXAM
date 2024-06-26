const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mysqlClient = require("./config/db/databaseConnection");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "./config/env/dev.env"),
});

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(helmet());

// Database connection
mysqlClient.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.info("Conexión exitosa a la base de datos");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// If the payload is too large, the server will return a 413 status code
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err && err.status === 400) {
    return res.status(413).send({ error: "Request entity too large" });
  }
  next();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
