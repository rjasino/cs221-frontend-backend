import jwt from "jsonwebtoken";

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
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message || "Invalid or expired token",
    });
  }
};

export default { authenticateToken };
