import bcrypt from "bcrypt";
import Customer from "../models/Customer.js";
import { generateTokens, verifyRefreshToken } from "../utils/tokenUtils.js";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
} from "../utils/responseUtils.js";
import config from "../config/index.js";

/**
 * Register a new user
 */
export const register = async (req, res, next) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    // Check if user already exists
    const existingUsername = await Customer.findByUsername(username);
    if (existingUsername) {
      return errorResponse(res, "Username already exists", 409);
    }

    const existingEmail = await Customer.findByEmail(email);
    if (existingEmail) {
      return errorResponse(res, "Email already exists", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new customer
    const newCustomer = await Customer.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newCustomer);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...config.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, config.cookieOptions);

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = newCustomer;

    return successResponse(
      res,
      "User registered successfully",
      {
        user: customerWithoutPassword,
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const customer = await Customer.findByUsername(username);
    if (!customer) {
      return unauthorizedResponse(res, "Invalid username or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return unauthorizedResponse(res, "Invalid username or password");
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(customer);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...config.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, config.cookieOptions);

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer;

    return successResponse(res, "Login successful", {
      user: customerWithoutPassword,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req, res, next) => {
  try {
    // Get refresh token from cookies or body
    const refreshTokenValue =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshTokenValue) {
      return unauthorizedResponse(res, "Refresh token required");
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshTokenValue);

    // Find user
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return unauthorizedResponse(res, "User not found");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(customer);

    // Set new tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...config.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, config.cookieOptions);

    return successResponse(res, "Token refreshed successfully", {
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return unauthorizedResponse(res, error.message || "Invalid refresh token");
  }
};

/**
 * Logout user
 */
export const logout = async (req, res, next) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, "Logout successful");
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return errorResponse(res, "User not found", 404);
    }

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer;

    return successResponse(res, "Profile retrieved successfully", {
      user: customerWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify token endpoint
 */
export const verifyToken = async (req, res, next) => {
  try {
    // If middleware passed, token is valid
    return successResponse(res, "Token is valid", {
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  verifyToken,
};
