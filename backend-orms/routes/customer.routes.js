import express from "express";
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", authenticateToken, createCustomer);
router.put("/:id", authenticateToken, updateCustomer);
router.delete("/:id", authenticateToken, deleteCustomer);

export default router;
