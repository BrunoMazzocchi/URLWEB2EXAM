const courseService = require("../services/courseService");

async function getCoursesByUserId(req, res) {
  const userId = req.userId;
  try {
    const courses = await courseService.getCoursesByUserId(userId);

    res.status(200).json({ message: "Courses fetched successfully", courses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
}

module.exports = { getCoursesByUserId };
