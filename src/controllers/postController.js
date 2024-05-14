const postService = require("../services/postService");
const PostModel = require("../models/postModel");

async function createPost(req, res) {
  const userId = req.userId;

  try {
    const { image, ...postData } = req.body;

    // Ensure the image is in base64 format
    if (!image || !image.startsWith("data:image/")) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const newPost = await postService.createPost(userId, {
      ...postData,
      image,
    });

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
}

async function editPost(req, res) {
  try {
    const { postId } = req.params;
    const { image, ...postData } = req.body;

    // Ensure the image is in base64 format if provided
    if (image && !image.startsWith("data:image/")) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const updatedPost = await postService.editPost(postId, {
      ...postData,
      image,
    });

    res.json(updatedPost);
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
      post.id.image = `${post.id.image}`;
    });

    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting posts", error: error.message });
  }
}

module.exports = { createPost, editPost, deletePost, getImageByUserId };
