const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const postMiddleware = require("../middlewares/postMiddleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/me", authMiddleware, postMiddleware, authController.getDataByUser);

module.exports = router;
