
import express, { Express } from "express";
import cors, { CorsOptions } from "cors";

import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/event.routes";
import bookingRoutes from "./routes/booking.routes";
import userRoutes from "./routes/user.routes";
import chatbotRoutes from "./routes/chatbot.route";

import { authenticateToken } from "./middleware/auth.middleware";

// Initialize the express app
const app: Express = express();

// Define Middlewares
app.use(express.json());

// Allowed origins list
const allowedOrigins = [
    "http://localhost:5173"
];

const corsOptions: CorsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    }
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/event", authenticateToken, eventRoutes);
app.use("/api/booking", authenticateToken, bookingRoutes);
app.use("/api/user", authenticateToken, userRoutes);

// Chatbot route
app.use("/api/chatbot", chatbotRoutes);

export default app;
