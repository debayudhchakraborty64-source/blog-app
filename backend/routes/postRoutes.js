import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPosts).post(protect, createPost);

// Comments
router.route("/:postId/comments").get(getComments).post(protect, addComment);
router
  .route("/:postId/comments/:commentId")
  .delete(protect, deleteComment);

// Likes + single post
router.route("/:id/like").put(protect, toggleLike);
router
  .route("/:id")
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
