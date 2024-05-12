class CourseModel {
  constructor(course_id, title, description, state, created_at, last_updated) {
    this.course_id = course_id;
    this.title = title;
    this.description = description;
    this.state = state;
    this.created_at = created_at;
    this.last_updated = last_updated;
  }
}

module.exports = CourseModel;
