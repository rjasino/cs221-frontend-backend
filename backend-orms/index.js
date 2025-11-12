import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    allowedHeaders: "*",
    methods: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blataditz Retail API is running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
});

// Connect to database and start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
});
