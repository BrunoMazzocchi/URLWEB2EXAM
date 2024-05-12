const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const tokenMiddleware = require("../middlewares/tokenMiddleware");

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags:
 *       - Courses
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Courses not found
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
  "/courses",
  authMiddleware,
  tokenMiddleware,
  courseController.getCoursesByUserId
);

module.exports = router;
