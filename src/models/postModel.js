class PostModel {
  constructor(
    id,
    title,
    content,
    image,
    description,
    userId,
    state,
    createdAt,
    lastUpdated
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.image = image;
    this.description = description;
    this.userId = userId;
    this.state = state;
    this.createdAt = createdAt;
    this.lastUpdated = lastUpdated;
  }
}

module.exports = PostModel;
