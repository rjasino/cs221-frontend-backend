import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  verifyToken,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, sanitizeInput } from "../middleware/validation.js";
import {
  validateRegistration,
  validateLogin,
} from "../utils/validationUtils.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  sanitizeInput,
  validate(validateRegistration),
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", sanitizeInput, validate(validateLogin), login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post("/refresh", refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and clear cookies
 * @access  Private
 */
router.post("/logout", authenticateToken, logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authenticateToken, getProfile);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify if token is valid
 * @access  Private
 */
router.get("/verify", authenticateToken, verifyToken);

export default router;
