import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// ---------- global middleware ----------
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- health check ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ---------- routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ---------- 404 + error handling ----------
app.use(notFound);
app.use(errorHandler);

export default app;
