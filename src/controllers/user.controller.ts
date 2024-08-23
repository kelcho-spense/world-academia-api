import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user.model";
import mongoose from "mongoose";
import { UpdateUserInput, CreateUserInput, LoginUserInput } from '../schema/user.schema'
import "dotenv/config"

const JWT_SECRET = process.env.JWT_SECRET as string

// Login function for users and admins
export const loginUser = async (req: Request, res: Response) => {
    const loginUsersInput: LoginUserInput = req.body;
    console.log(loginUsersInput)

    try {
        // Find the user by email
        console.log("1")
        const user = await User.findOne({ email: loginUsersInput.email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("2")
        if (!user.isApproved) {
            return res.status(403).json({ message: "User not approved" });
        }
        console.log("3")
        // Check if the password is correct
        const isMatch = await bcrypt.compare(loginUsersInput.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        console.log("4")
        console.log({ user })
        console.log(JWT_SECRET)
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: "12h" }
        );
        console.log("5")
        const userDetails = {
            userId: user._id,
            email: user.email,
            role: user.role,
        }
        console.log("6")
        const Bearer = `Bearer ${token}`;

        res.json({ Bearer, user: userDetails });
    } catch (err) {
        res.status(500).json({ message: "Server error" + err });
    }
};

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
    const regUser: CreateUserInput = req.body

    try {
        const existingUser = await User.findOne({ email: regUser.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Determine if the user should be approved automatically
        const isApproved = regUser.role === "user";

        // Create a new user instance
        const newUser = new User({
            email: regUser.email,
            password: regUser.password,
            role: regUser.role,
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
    const approvedBy = req.body.approvedBy

    try {
        const adminAprover = await User.findById(approvedBy);
        if (!adminAprover) {
            return res.status(403).json({ message: "User not Unauthorized to Approve" })
        }

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
        res.json({ message: "User approved successfully", user: user._id });
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
    const updates: UpdateUserInput = req.body;
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
