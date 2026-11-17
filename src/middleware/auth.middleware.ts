
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Check incoming request headers
    console.log("Request URL:", req.originalUrl);
    console.log("Authorization Header Exists:", !!req.headers.authorization);

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log("Authentication failed: Token not found");

        res.status(401).json({
            error: "Auth Token is not preset in request header"
        });
        return;
    }

    // Verify JWT token
    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) {
            console.log("JWT Verification Error:", error.message);

            res.status(401).json({
                error: "invalid or expired auth token"
            });
            return;
        }

        console.log("Token verified successfully");

        (req as Request & { user?: any }).user = user;

        next();
    });
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as Request & { user?: any }).user;

        if (!user || !roles.includes(user.role)) {
            res.status(403).json({
                error: "Access denied! User does not have permission to perform this operation"
            });
            return;
        }

        next();
    };
};
