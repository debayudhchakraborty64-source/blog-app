import asyncHandler from "../middleware/asyncHandler.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// Escape user input before turning it into a RegExp
const escapeRegex = (text = "") => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toTagList = (tags) =>
  Array.isArray(tags)
    ? tags.map((t) => String(t).trim()).filter(Boolean)
    : String(tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

// @desc    List posts (paginated + search)
// @route   GET /api/posts?page=1&search=react
// @access  Public
export const getPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 9, 1),
    50
  );
  const search = (req.query.search || "").trim();

  const filter = {};
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: rx }, { tags: rx }];
  }

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name avatar");

  res.json({
    posts,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

// @desc    Get a single post
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "name avatar bio"
  );

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.json(post);
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, coverImage = "", tags = [] } = req.body;

  if (!title?.trim() || !content?.trim()) {
    res.status(400);
    throw new Error("Title and content are required");
  }

  let post = await Post.create({
    title,
    content,
    coverImage,
    tags: toTagList(tags),
    author: req.user._id,
  });

  post = await post.populate("author", "name avatar");
  res.status(201).json(post);
});

// @desc    Update a post (author only)
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (String(post.author) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only edit your own posts");
  }

  const { title, content, coverImage, tags } = req.body;
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;
  if (coverImage !== undefined) post.coverImage = coverImage;
  if (tags !== undefined) post.tags = toTagList(tags);

  const updated = await post.save();
  const populated = await updated.populate("author", "name avatar");
  res.json(populated);
});

// @desc    Delete a post (author only) — also removes its comments
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (String(post.author) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only delete your own posts");
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();

  res.json({ message: "Post removed" });
});

// @desc    Like / unlike a post (toggle)
// @route   PUT /api/posts/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const userId = String(req.user._id);
  const alreadyLiked = post.likes.some((u) => String(u) === userId);

  if (alreadyLiked) {
    post.likes = post.likes.filter((u) => String(u) !== userId);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  res.json({
    likes: post.likes,
    likesCount: post.likes.length,
    liked: !alreadyLiked,
  });
});
