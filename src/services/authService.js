const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;
const mysqlClient = require("../config/db/databaseConnection");
const logger = require("../../logger");

async function registerUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    };

    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const values = [newUser.username, newUser.email, hashedPassword];

    const result = await new Promise((resolve, reject) => {
      mysqlClient.query(query, values, (err, result) => {
        if (err) {
          console.error("Database insertion error:", err);
          return reject(err);
        }
        resolve(result);
      });
    });

    console.log("Insert result:", result);

    const resultUser = new User(
      newUser.username,
      newUser.email,
      result.insertId
    );

    logger.info("User registered successfully" + resultUser.userId);
    return resultUser;
  } catch (error) {
    console.error("Error during user registration:", error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const query = `SELECT * FROM users WHERE email = '${email}'`;

    const result = await new Promise((resolve, reject) => {
      mysqlClient.query(query, (err, result) => {
        if (err) reject("Error logging in");
        resolve(result);
      });
    });

    if (result.length === 0) {
      throw new Error("User not found");
    }

    const user = result[0];

    const match = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) reject("Incorrect credentials");
        resolve(result);
      });
    });

    if (!match) {
      throw new Error("Incorrect credentials");
    }

    const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info("User logged in successfully" + user.user_id + " " + token);
    return token;
  } catch (error) {
    throw error;
  }
}

async function logout(token) {
  const query = `INSERT INTO expired_token (token) VALUES ('${token}')`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  logger.info("User logged out successfully");
  return result;
}

async function getDataByUserId(userId) {
  const query = `SELECT * FROM users WHERE user_id = '${userId}'`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  const newUser = new User();
  newUser.username = result[0].name;
  newUser.email = result[0].email;
  newUser.userId = result[0].user_id;

  logger.info("User data retrieved successfully" + newUser.userId);
  return newUser;
}

module.exports = { registerUser, loginUser, logout, getDataByUserId };
