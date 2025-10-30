import express from "express";
import dotenv from "dotenv";
import mongodb from "mongodb";
import jwt from "jsonwebtoken";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
    allowedHeaders: "*",
    methods: "*",
  })
); // Adjust the origin as needed

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//MongoDB connection setup would go here
const client = new mongodb.MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_NAME || "blataditz-retail";
const db = client.db(dbName);
const customersCollection = db.collection("customers");

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

//Routes would go here CRUD operations for users
//Protected routes would require authentication middleware
app.post("/customers", authenticateToken, async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = req.body;
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Missing required fields",
        details:
          "username, email, password, first_name, last_name are required",
      });
    }

    const newCustomer = { ...req.body, created_at: new Date() };
    const result = await customersCollection.insertOne(newCustomer);

    res
      .status(201)
      .json({ message: "Customer created", customerId: result.insertedId });
  } catch (error) {
    res.status(500).json({
      message: "Error creating customer",
      details: error.message,
    });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const { username, email } = req.query;
    let filter = {};

    if (username) filter.username = username;
    if (email) filter.email = email;

    const customers = await customersCollection.find(filter).toArray();
    res.status(200).json({ data: customers, count: customers.length });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
      details: error.message,
    });
  }
});

app.get("/customers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    const customer = await customersCollection.findOne({
      _id: new mongodb.ObjectId(id),
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json({ data: customer });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer",
      details: error.message,
    });
  }
});

app.put("/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }
    // Optional: Validate required fields if necessary
    const { username, email, password, first_name, last_name } = req.body;
    if (!username || !email || !password || !first_name || !last_name) {
      return res.status(400).json({
        message: "Missing required fields",
        details:
          "username, email, password, first_name, last_name are required",
      });
    }

    const updatedCustomer = { ...req.body, updated_at: new Date() };
    const result = await customersCollection.updateOne(
      { _id: new mongodb.ObjectId(id) },
      { $set: updatedCustomer }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer updated successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error updating customer",
      details: error.message,
    });
  }
});

app.delete("/customers/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongodb.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid customer ID" });
    }

    const result = await customersCollection.deleteOne({
      _id: new mongodb.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting customer",
      details: error.message,
    });
  }
});

app.post("/generateToken", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
});

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
