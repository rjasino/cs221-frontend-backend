import { verifyAccessToken } from "../utils/tokenUtils.js";
import {
  unauthorizedResponse,
  forbiddenResponse,
} from "../utils/responseUtils.js";

/**
 * Authentication middleware - validates access token from cookies or headers
 */
export const authenticateToken = (req, res, next) => {
  try {
    // Try to get token from cookies first
    let token = req.cookies?.accessToken;

    // If not in cookies, try Authorization header
    if (!token) {
      const authHeader = req.headers["authorization"];
      token = authHeader && authHeader.split(" ")[1];
    }

    if (!token) {
      return unauthorizedResponse(res, "Access token required");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return forbiddenResponse(res, error.message || "Invalid or expired token");
  }
};

/**
 * Optional authentication - doesn't fail if token is missing
 */
export const optionalAuth = (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token) {
      const authHeader = req.headers["authorization"];
      token = authHeader && authHeader.split(" ")[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // Token is invalid but we don't fail the request
    req.user = null;
  }

  next();
};

export default { authenticateToken, optionalAuth };
