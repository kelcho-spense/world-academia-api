import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const authMiddleware = (requiredRole?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Allow shared action for both 'user' and 'admin' roles
      if (requiredRole === "shared" && !["user", "admin"].includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (requiredRole && user.role !== requiredRole && requiredRole !== "shared") {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!user.isApproved && user.role !== "admin") {
        return res.status(403).json({ message: "User not approved" });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
