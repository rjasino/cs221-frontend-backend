import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new mongodb.MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_NAME || "blataditz-retail";

let db = null;

export const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectToDatabase first.");
  }
  return db;
};

export const getCollection = (collectionName) => {
  return getDatabase().collection(collectionName);
};

export default { connectToDatabase, getDatabase, getCollection };
