import express from "express";
import {
  registerUser,
  approveUser,
  getAllUsers,
  updateUserProfile,
  deleteUserProfile,
  sharedAction,
  loginUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);  // Login route for users and admins

// Admin routes
userRouter.put("/approve/:userId", authMiddleware("admin"), approveUser);
userRouter.get("/users", authMiddleware("admin"), getAllUsers);

// User/Admin routes
userRouter.put("/me", authMiddleware(), updateUserProfile);
userRouter.delete("/me", authMiddleware(), deleteUserProfile);

// Shared action route for both 'user' and 'admin' roles
userRouter.get("/shared-action", authMiddleware("shared"), sharedAction);

export default userRouter;
