const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const tokenMiddleware = require("../middlewares/tokenMiddleware");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */

router.post("/register", authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid login credentials
 *       500:
 *         description: Internal server error
 */

router.post("/login", authController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token for authentication
 *         required: true
 *         schema:
 *           type: string
 */

router.post("/logout", authMiddleware, tokenMiddleware, authController.logout);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user by email
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User found successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token for authentication
 *         required: true
 *         schema:
 *           type: string
 */

router.get(
  "/me",
  authMiddleware,
  tokenMiddleware,
  authController.getUserByEmail
);

module.exports = router;
