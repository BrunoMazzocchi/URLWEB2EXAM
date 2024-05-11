const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authMiddleware = require("../middlewares/authMiddleware");
const postMiddleware = require("../middlewares/postMiddleware");

router.post(
  "/create",
  authMiddleware,
  postMiddleware,
  postController.createPost
);

router.put("/edit", authMiddleware, postMiddleware, postController.editPost);

router.delete(
  "/delete/:postId",
  authMiddleware,
  postMiddleware,
  postController.deletePost
);

router.get(
  "/image",
  authMiddleware,
  postMiddleware,
  postController.getImageByUserId
);

module.exports = router;
