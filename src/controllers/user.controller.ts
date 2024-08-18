import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string

// Login function for users and admins
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the user is approved
        if (!user.isApproved && user.role !== "admin") {
            return res.status(403).json({ message: "User not approved" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        const Bearer = `Bearer ${token}`;

        res.json({ Bearer });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Determine if the user should be approved automatically
        const isApproved = role === "user";

        // Create a new user instance
        const newUser = new User({
            email,
            password,
            role,
            isApproved
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: newUser._id });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Admin approves a user
export const approveUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isApproved) {
            return res.status(400).json({ message: "User is already approved" });
        }

        // Ensure req.user is not undefined and that _id is a valid ObjectId
        if (!req.user || !req.user._id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        user.isApproved = true;
        user.approvedBy = req.user._id as mongoose.Schema.Types.ObjectId;

        await user.save();
        res.json({ message: "User approved successfully", user. });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Admin gets all users (excluding passwords)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// User/Admin updates their own profile (excluding role and approval status)
export const updateUserProfile = async (req: Request, res: Response) => {
    const updates = req.body;
    delete updates.role; // Prevent role from being updated by user
    delete updates.isApproved; // Prevent approval status from being updated by user

    try {
        // Find the user by ID
        const user = await User.findById(req.user!._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Update the fields
        if (updates.password) {
            user.password = updates.password; // This will trigger the 'save' hook to hash the password
        }
        if (updates.email) {
            user.email = updates.email;
        }
        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ message: "Profile updated successfully", user: user._id });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// User/Admin deletes their own profile
export const deleteUserProfile = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.user!._id);
        res.json({ message: "User profile deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Shared action for both 'user' and 'admin' roles
export const sharedAction = async (req: Request, res: Response) => {
    // Implement shared logic here
    res.json({ message: "This action can be performed by both users and admins" });
};
