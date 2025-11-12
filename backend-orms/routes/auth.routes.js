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

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", authenticateToken, logout);
router.get("/profile", authenticateToken, getProfile);
router.get("/verify", authenticateToken, verifyToken);

export default router;
