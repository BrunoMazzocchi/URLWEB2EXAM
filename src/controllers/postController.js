const postService = require("../services/postService");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const PostModel = require("../models/postModel");

const storagePath = "uploads/";
const upload = multer({ dest: storagePath });
function encodeFileAsBase64(file) {
  const fileData = fs.readFileSync(file);
  return Buffer.from(fileData).toString("base64");
}

function encodeFileAsBase64(file) {
  const fileData = fs.readFileSync(file);
  return Buffer.from(fileData).toString("base64");
}

async function createPost(req, res) {
  const userId = req.userId;
  console.log(req);
  try {
    upload.single("image")(req, res, async function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Upload Error", error: err.message });
      }

      const base64Image = encodeFileAsBase64(req.file.path);

      fs.unlinkSync(req.file.path);

      const postData = { ...req.body, image: base64Image };

      const newPost = await postService.createPost(userId, postData);

      res
        .status(201)
        .json({ message: "Post created successfully", post: newPost });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
}

async function editPost(req, res) {
  try {
    const { postId } = req.params;

    // Check if there's an image uploaded in the request
    if (req.file) {
      // Read the uploaded file and encode it as base64
      const base64Image = encodeFileAsBase64(req.file.path);

      // Delete the uploaded file as it's not needed anymore
      fs.unlinkSync(req.file.path);

      // Update the post data including the new image
      const postDataWithImage = { ...req.body, image: base64Image };
      const post = PostModel(
        postId,
        postDataWithImage.title,
        postDataWithImage.content,
        postDataWithImage.image,
        postDataWithImage.description,
        postDataWithImage.userId,
        postDataWithImage.state,
        postDataWithImage.createdAt,
        postDataWithImage.lastUpdated
      );

      // Update the post with the new data
      const updatedPost = await postService.editPost(postId, post);

      // Return the updated post
      res.json(updatedPost);
    } else {
      // If no image was uploaded, update the post with existing data
      const postData = req.body;
      const updatedPost = await postService.editPost(postId, postData);
      res.json(updatedPost);
    }
  } catch (error) {
    console.error("Error editing post:", error);
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
}
async function deletePost(req, res) {
  try {
    const { postId } = req.params;

    await postService.deletePost(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
}

async function getImageByUserId(req, res) {
  const userId = req.userId;
  try {
    const posts = await postService.getPostsByID(userId);
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    posts.forEach((post) => {
      post.id.image = `data:image/jpeg;base64,${post.id.image}`;
    });

    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting posts", error: error.message });
  }
}
module.exports = { createPost, editPost, deletePost, getImageByUserId };
