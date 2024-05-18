const mysqlClient = require("../config/db/databaseConnection");
const PostModel = require("../models/postModel");
const logger = require("../../logger");

async function createPost(userId, postData) {
  const query = `INSERT INTO posts (title, content, image, description, user_id) VALUES
   ('${postData.title}', '${postData.content}', '${postData.image}', '${postData.description}', '${userId}')`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  logger.info("Post created successfully");
  return result;
}

async function editPost(postId, postData) {
  const query = `UPDATE posts SET 
                 title = '${postData.title}',
                 content = '${postData.content}',
                 image = '${postData.image}',
                 description = '${postData.description}',
                 user_id = '11',
                 state = '2',
                 last_updated = NOW()
                 WHERE id = '${postId}'`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  return result;
}

async function deletePost(postId) {
  const query = `UPDATE posts SET state=3 WHERE id=${postId}`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });

  logger.info("Post deleted successfully");
  return result;
}

async function getPostsByID(userId) {
  const query = `SELECT * FROM posts WHERE user_id=${userId} AND state != 3 ORDER BY last_updated DESC`;

  const result = await new Promise((resolve, reject) => {
    mysqlClient.query(query, (err, result) => {
      if (err) reject(err);
      if (!result || result.length === 0) {
        const error = new Error("User not found");
        error.code = "NOT_FOUND";
        reject(error);
      } else {
        const postModels = result.map((row) => new PostModel(row));
        resolve(postModels);
      }
    });
  });

  logger.info("Posts retrieved successfully");
  return result;
}

module.exports = { createPost, editPost, deletePost, getPostsByID };
