const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const mysqlClient = require("./config/db/databaseConnection");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerJsdoc = require("swagger-jsdoc");

require("dotenv").config({
  path: path.resolve(__dirname, "./config/env/dev.env"),
});

// Swagger setup
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Course API",
      version: "1.0.0",
      description: "Api to handle courses and users",
    },
  },
  apis: ["./routes/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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
const courseRoutes = require("./routes/courseRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Not found middleware
app.use((req, res, next) => {
  res.status(404).send("Not found");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
