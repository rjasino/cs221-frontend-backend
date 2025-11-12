import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";

// ============================================
// VALIDATION FUNCTIONS
// ============================================

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const validateRegistration = (data) => {
  const errors = [];

  // Username validation
  if (!data.username) {
    errors.push("Username is required");
  }
  if (!isValidUsername(data.username)) {
    errors.push(
      "Username must be 3-20 characters and contain only letters, numbers, and underscores"
    );
  }

  // Email validation
  if (!data.email) {
    errors.push("Email is required");
  }
  if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  // Password validation
  if (!data.password) {
    errors.push("Password is required");
  }
  if (!isValidPassword(data.password)) {
    errors.push(
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number"
    );
  }

  // Password confirmation validation
  if (!data.password_confirmation) {
    errors.push("Password confirmation is required");
  }
  if (data.password !== data.password_confirmation) {
    errors.push("Passwords do not match");
  }

  // First name validation
  if (!data.first_name || data.first_name.trim() === "") {
    errors.push("First name is required");
  }

  // Last name validation
  if (!data.last_name || data.last_name.trim() === "") {
    errors.push("Last name is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = [];

  // Username validation
  if (!data.username || data.username.trim() === "") {
    errors.push("Username is required");
  }

  // Password validation
  if (!data.password || data.password.trim() === "") {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// TOKEN FUNCTIONS
// ============================================

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (payload) => {
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";
  return jwt.sign(payload, refreshSecret, {
    expiresIn: "7d",
  });
};

const verifyRefreshToken = (token) => {
  const refreshSecret =
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh";
  try {
    return jwt.verify(token, refreshSecret);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

const generateTokens = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

// ============================================
// CONTROLLERS
// ============================================

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    // Trim input
    const userData = {
      username: req.body.username?.trim(),
      email: req.body.email?.trim(),
      password: req.body.password,
      password_confirmation: req.body.password_confirmation,
      first_name: req.body.first_name?.trim(),
      last_name: req.body.last_name?.trim(),
    };

    // Validate input
    const validation = validateRegistration(userData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { username, email, password, first_name, last_name } = userData;

    // Check if user already exists
    const existingUsername = await Customer.findByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const existingEmail = await Customer.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
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

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = newCustomer;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: customerWithoutPassword,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    // Trim input
    const loginData = {
      username: req.body.username?.trim(),
      password: req.body.password,
    };

    // Validate input
    const validation = validateLogin(loginData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    const { username, password } = loginData;

    // Find user by username
    const customer = await Customer.findByUsername(username);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(customer);

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: customerWithoutPassword,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookies or body
    const refreshTokenValue =
      req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshTokenValue) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshTokenValue);

    // Find user
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      generateTokens(customer);

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    // Set new tokens in cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid refresh token",
    });
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer;

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: customerWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

/**
 * Verify token endpoint
 */
export const verifyToken = async (req, res) => {
  try {
    // If middleware passed, token is valid
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying token",
      error: error.message,
    });
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
