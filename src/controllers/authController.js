const { log } = require("winston");
const authService = require("../services/authService");

async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    const newUser = await authService.registerUser({
      username,
      email,
      password,
    });

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
    const token = req.headers.authorization.split(" ")[1];

    await authService.logout(token);

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
}

module.exports = { register, login, logout };
