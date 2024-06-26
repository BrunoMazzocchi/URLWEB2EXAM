const { log } = require("winston");
const authService = require("../services/authService");

async function register(req, res) {
  try {
    let { username, email, password, role } = req.body;

    if (role == null) {
      role = 2;
    }

    if (!Number.isInteger(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const newUser = await authService.registerUser(
      {
        username,
        email,
        password,
      },
      role
    );

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const token = await authService.loginUser(email, password);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(401).json({ message: "Login failed", error: error.message });
  }
}

async function logout(req, res) {
  try {
    const token = req.headers.authorization;

    await authService.logout(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
}

async function getDataByUser(req, res) {
  const userId = req.userId;

  try {
    const user = await authService.getDataByUserId(userId);

    res.status(200).json({ message: "Success", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user", error: error.message });
  }
}

module.exports = { register, login, logout, getDataByUser };
