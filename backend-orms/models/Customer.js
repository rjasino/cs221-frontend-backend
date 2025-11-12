import { getCollection } from "../config/database.js";
import mongodb from "mongodb";

/**
 * Customer Model
 */
class Customer {
  constructor() {
    this.collectionName = "customers";
  }

  getCollection() {
    return getCollection(this.collectionName);
  }

  /**
   * Create a new customer
   */
  async create(customerData) {
    const customer = {
      ...customerData,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await this.getCollection().insertOne(customer);
    return { ...customer, _id: result.insertedId };
  }

  /**
   * Find customer by username
   */
  async findByUsername(username) {
    return await this.getCollection().findOne({ username });
  }

  /**
   * Find customer by email
   */
  async findByEmail(email) {
    return await this.getCollection().findOne({ email });
  }

  /**
   * Find customer by ID
   */
  async findById(id) {
    if (!mongodb.ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }
    return await this.getCollection().findOne({
      _id: new mongodb.ObjectId(id),
    });
  }

  /**
   * Find all customers with optional filters
   */
  async findAll(filter = {}, options = {}) {
    const { limit = 100, skip = 0, sort = { created_at: -1 } } = options;

    const customers = await this.getCollection()
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await this.getCollection().countDocuments(filter);

    return { customers, total };
  }

  /**
   * Update customer by ID
   */
  async updateById(id, updateData) {
    if (!mongodb.ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }

    const updateFields = {
      ...updateData,
      updated_at: new Date(),
    };

    // Remove password from update if it's not being changed
    if (updateData.password === undefined) {
      delete updateFields.password;
    }

    const result = await this.getCollection().updateOne(
      { _id: new mongodb.ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      throw new Error("Customer not found");
    }

    return await this.findById(id);
  }

  /**
   * Delete customer by ID
   */
  async deleteById(id) {
    if (!mongodb.ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }

    const result = await this.getCollection().deleteOne({
      _id: new mongodb.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      throw new Error("Customer not found");
    }

    return true;
  }

  /**
   * Check if username exists
   */
  async usernameExists(username) {
    const count = await this.getCollection().countDocuments({ username });
    return count > 0;
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    const count = await this.getCollection().countDocuments({ email });
    return count > 0;
  }
}

export default new Customer();
