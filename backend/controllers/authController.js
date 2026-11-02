import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

// @desc    Log in
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user); // password is excluded by the schema's select: false
});
