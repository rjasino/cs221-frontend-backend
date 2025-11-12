import { errorResponse } from "../utils/responseUtils.js";

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field} already exists`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 403;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 403;
    message = "Token expired";
  }

  // Validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  return errorResponse(res, message, statusCode, {
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export default { errorHandler, notFoundHandler };
