import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "../utils/responseUtils.js";

/**
 * Get all customers
 */
export const getAllCustomers = async (req, res, next) => {
  try {
    const { username, email, page = 1, limit = 100 } = req.query;

    let filter = {};
    if (username) filter.username = username;
    if (email) filter.email = email;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const options = {
      skip,
      limit: parseInt(limit),
      sort: { created_at: -1 },
    };

    const { customers, total } = await Customer.findAll(filter, options);

    // Remove passwords from response
    const customersWithoutPasswords = customers.map(
      ({ password, ...customer }) => customer
    );

    return successResponse(res, "Customers retrieved successfully", {
      customers: customersWithoutPasswords,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get customer by ID
 */
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return notFoundResponse(res, "Customer not found");
    }

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = customer;

    return successResponse(res, "Customer retrieved successfully", {
      customer: customerWithoutPassword,
    });
  } catch (error) {
    if (error.message === "Invalid customer ID") {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

/**
 * Create new customer (admin only - requires authentication)
 */
export const createCustomer = async (req, res, next) => {
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

    // Create customer
    const newCustomer = await Customer.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = newCustomer;

    return successResponse(
      res,
      "Customer created successfully",
      { customer: customerWithoutPassword },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update customer by ID
 */
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Check if username is being changed and already exists
    if (updateData.username) {
      const existingUsername = await Customer.findByUsername(
        updateData.username
      );
      if (existingUsername && existingUsername._id.toString() !== id) {
        return errorResponse(res, "Username already exists", 409);
      }
    }

    // Check if email is being changed and already exists
    if (updateData.email) {
      const existingEmail = await Customer.findByEmail(updateData.email);
      if (existingEmail && existingEmail._id.toString() !== id) {
        return errorResponse(res, "Email already exists", 409);
      }
    }

    const updatedCustomer = await Customer.updateById(id, updateData);

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = updatedCustomer;

    return successResponse(res, "Customer updated successfully", {
      customer: customerWithoutPassword,
    });
  } catch (error) {
    if (error.message === "Invalid customer ID") {
      return errorResponse(res, error.message, 400);
    }
    if (error.message === "Customer not found") {
      return notFoundResponse(res, error.message);
    }
    next(error);
  }
};

/**
 * Delete customer by ID
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Customer.deleteById(id);

    return successResponse(res, "Customer deleted successfully");
  } catch (error) {
    if (error.message === "Invalid customer ID") {
      return errorResponse(res, error.message, 400);
    }
    if (error.message === "Customer not found") {
      return notFoundResponse(res, error.message);
    }
    next(error);
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
