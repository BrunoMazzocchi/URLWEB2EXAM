const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mysqlClient = require("./config/db/databaseConnection");

require("dotenv").config({ path: "./config/dev" });

// Middleware
app.use(bodyParser.json());
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

app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
