import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from './db';
const JWT_SECRET = "snonfiq";
// Define a custom interface to extend the Request type
export interface CustomRequest extends Request {
    userId?: string; // Add userId as an optional property
}

// Replace with a secure secret key in production

export const Middleware = (roleRequired: "user" | "admin") => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(403).json({ message: "Token is required" });
        }

        // Extract the token from the Authorization header
        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            return res.status(403).json({ message: "Invalid Authorization header format" });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string };

            // Attach the userId to the request object
            req.userId = decoded.id;

            // Validate the user's role
            if (roleRequired === "admin" && decoded.role !== "admin") {
                return res.status(403).json({ message: "Admin access required" });
            }

            next();
        } catch (error) {
            console.error("Error verifying token:", error);
            return res.status(403).json({ message: "Invalid or expired token" });
        }
    };
};