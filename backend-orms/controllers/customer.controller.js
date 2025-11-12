import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";

export const getAllCustomers = async (req, res) => {
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
    const customersWithoutPasswords = customers.map(({ password, ...customer }) => customer);

    return res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: {
        customers: customersWithoutPasswords,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get all customers error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving customers",
      error: error.message,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const { password: _, ...customerWithoutPassword } = customer;

    return res.status(200).json({
      success: true,
      message: "Customer retrieved successfully",
      data: { customer: customerWithoutPassword },
    });
  } catch (error) {
    if (error.message === "Invalid customer ID") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Get customer by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving customer",
      error: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;

    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: ["username, email, password, first_name, last_name are required"],
      });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({
      username,
      email,
      password: hashedPassword,
      first_name,
      last_name,
    });

    const { password: _, ...customerWithoutPassword } = newCustomer;

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: { customer: customerWithoutPassword },
    });
  } catch (error) {
    console.error("Create customer error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating customer",
      error: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    if (updateData.username) {
      const existingUsername = await Customer.findByUsername(updateData.username);
      if (existingUsername && existingUsername._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Username already exists",
        });
      }
    }

    if (updateData.email) {
      const existingEmail = await Customer.findByEmail(updateData.email);
      if (existingEmail && existingEmail._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const updatedCustomer = await Customer.updateById(id, updateData);
    const { password: _, ...customerWithoutPassword } = updatedCustomer;

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: { customer: customerWithoutPassword },
    });
  } catch (error) {
    if (error.message === "Invalid customer ID") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Update customer error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating customer",
      error: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.deleteById(id);

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    if (error.message === "Invalid customer ID") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message === "Customer not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    console.error("Delete customer error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting customer",
      error: error.message,
    });
  }
};

export default {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
