import mongoose from "mongoose";

/**
 * Connects to MongoDB using MONGO_URI from backend/.env.
 * Throws on failure so server.js can decide how to handle it.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined — check backend/.env");
  }

  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(
    `📦 MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
  );
  return conn;
};

export default connectDB;
