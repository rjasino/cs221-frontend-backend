import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, sanitizeInput } from "../middleware/validation.js";
import {
  validateRegistration,
  validateCustomerUpdate,
} from "../utils/validationUtils.js";

const router = express.Router();

/**
 * @route   GET /api/customers
 * @desc    Get all customers (with optional filters)
 * @access  Public
 */
router.get("/", getAllCustomers);

/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Public
 */
router.get("/:id", getCustomerById);

/**
 * @route   POST /api/customers
 * @desc    Create a new customer (admin only)
 * @access  Private
 */
router.post(
  "/",
  authenticateToken,
  sanitizeInput,
  validate(validateRegistration),
  createCustomer
);

/**
 * @route   PUT /api/customers/:id
 * @desc    Update customer by ID
 * @access  Private
 */
router.put(
  "/:id",
  authenticateToken,
  sanitizeInput,
  validate(validateCustomerUpdate),
  updateCustomer
);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete customer by ID
 * @access  Private
 */
router.delete("/:id", authenticateToken, deleteCustomer);

export default router;
