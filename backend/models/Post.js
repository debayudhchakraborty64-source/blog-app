import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      type: String,
      default: "",
      match: [/^(https?:\/\/.+)?$/, "Cover image must be a URL"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [30, "Tags cannot exceed 30 characters"],
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
