
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../model/user.model";

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        const username = process.env.ADMIN_USERNAME?.trim();
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD;

        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in .env");
        }

        if (!username || !email || !password) {
            throw new Error(
                "ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
            );
        }

        if (password.length < 8) {
            throw new Error("Admin password must contain at least 8 characters");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB connected successfully");

        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            throw new Error(
                "A user with this username or email already exists"
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin account created successfully!");
        console.log("Admin ID:", admin._id);
        console.log("Username:", admin.username);
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);

    } catch (error) {
        console.error("Admin creation failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();
