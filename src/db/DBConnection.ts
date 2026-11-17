import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Get the raw environment variable and clean any accidental quotes or spaces
let rawUrl = process.env.MONGO_DB_URL || process.env.MONGO_URI || process.env.MONGO_URL || "";
rawUrl = rawUrl.trim().replace(/^["'](.+)["']$/, '$1');

// Validate scheme, fallback to local MongoDB if invalid or empty
const MONGO_URL = (rawUrl.startsWith("mongodb://") || rawUrl.startsWith("mongodb+srv://"))
    ? rawUrl
    : "mongodb://127.0.0.1:27017/bookmyvibe";

const DBConnection = async () => {
    try {
        const connection = await mongoose.connect(MONGO_URL);
        return `Successfully connected to ${connection.connection.host}`;
    } catch (error) {
        return "MongoDB connection failed: " + error;
    }
};

export default DBConnection;