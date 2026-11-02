import asyncHandler from "../middleware/asyncHandler.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// @desc    List comments for a post (newest first)
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: -1 })
    .populate("author", "name avatar");

  res.json(comments);
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim()) {
    res.status(400);
    throw new Error("Comment cannot be empty");
  }

  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    post: post._id,
    author: req.user._id,
    content: content.trim(),
  });

  res.status(201).json(await comment.populate("author", "name avatar"));
});

// @desc    Delete a comment (comment author or post author)
// @route   DELETE /api/posts/:postId/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  const post = await Post.findById(comment.post);
  const isCommentAuthor =
    String(comment.author) === String(req.user._id);
  const isPostAuthor = post && String(post.author) === String(req.user._id);

  if (!isCommentAuthor && !isPostAuthor) {
    res.status(403);
    throw new Error("Not allowed to delete this comment");
  }

  await comment.deleteOne();
  res.json({ message: "Comment deleted" });
});
