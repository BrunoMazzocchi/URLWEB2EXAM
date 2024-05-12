const mysqlClient = require("../config/db/databaseConnection");
const CourseModel = require("../models/courseModel");
const UserCourseModel = require("../models/userCourseModel");

async function getCoursesByUserId(userId) {
  try {
    const query = `
      SELECT c.course_id, c.title, c.description, c.state, c.created_at, c.last_updated
      FROM courses c
      INNER JOIN user_course uc ON c.course_id = uc.course_id
      WHERE uc.user_id = ${userId}
    `;

    const result = await new Promise((resolve, reject) => {
      mysqlClient.query(query, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    // Mapping result to CourseModel objects
    const courses = result.map((course) => {
      return new CourseModel(
        course.course_id,
        course.title,
        course.description,
        course.state,
        course.created_at,
        course.last_updated
      );
    });

    return courses;
  } catch (error) {
    throw error;
  }
}

module.exports = { getCoursesByUserId };
