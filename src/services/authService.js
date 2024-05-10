const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = "2340238940234";
const mysqlClient = require("../config/db/databaseConnection");

async function registerUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User(userData.username, userData.email, hashedPassword);

    console.log(`Inserting user: ${JSON.stringify(newUser)}`);

    const query = `INSERT INTO users (name, email, password) VALUES ('${newUser.username}',  '${userData.email}', '${hashedPassword}')`;

    const result = await new Promise((resolve, reject) => {
      mysqlClient.query(query, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    console.log(`User inserted: ${JSON.stringify(result)}`);

    return result;
  } catch (error) {
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

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

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

  return result;
}

async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  return new User(result[0].name, result[0].email);
}

module.exports = { registerUser, loginUser, logout, getUserByEmail };
