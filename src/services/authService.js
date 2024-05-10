const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;
async function registerUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return savedUser;
  } catch (error) {
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new Error("Incorrect password");
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    throw error;
  }
}

module.exports = { registerUser, loginUser };
