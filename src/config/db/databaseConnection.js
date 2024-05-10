const mysql = require("mysql");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../env/dev.env"),
});
const mysqlClient = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

module.exports = mysqlClient;
