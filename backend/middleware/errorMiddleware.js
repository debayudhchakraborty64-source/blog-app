// 404 for unknown routes
export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
};

// Central error handler — all thrown errors end up here
export const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id format";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  } else if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate value for: ${Object.keys(err.keyValue).join(", ")}`;
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired — please log in again";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
