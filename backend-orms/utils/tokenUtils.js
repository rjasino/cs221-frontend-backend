import jwt from "jsonwebtoken";
import config from "../config/index.js";

/**
 * Generate access token
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.accessTokenExpiry,
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to encode in token
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.refreshTokenExpiry,
  });
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwtRefreshSecret);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing access and refresh tokens
 */
export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    email: user.email,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
};
