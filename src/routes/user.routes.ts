import express from "express";
import { registerUser, approveUser, getAllUsers, updateUserProfile, deleteUserProfile, sharedAction, loginUser } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import validateReq from '../middleware/validateResource';
import { updateUserSchema, loginUserSchema, createUserSchema } from '../schema/user.schema'

const userRouter = express.Router();

// Public routes
userRouter.post("/register", validateReq(createUserSchema), registerUser);
userRouter.post("/login", validateReq(loginUserSchema), loginUser);  // Login route for users and admins

// Admin routes
userRouter.put("/approve/:userId", validateReq(updateUserSchema), authMiddleware("admin"), approveUser);
userRouter.get("/users", authMiddleware("admin"), getAllUsers);

// User/Admin routes
userRouter.put("/me", validateReq(updateUserSchema), authMiddleware(), updateUserProfile);
userRouter.delete("/me", authMiddleware(), deleteUserProfile);

// Shared action route for both 'user' and 'admin' roles
userRouter.get("/shared-action", authMiddleware("shared"), sharedAction);

export default userRouter;

/**
 * @openapi
 * paths:
 *   /api/register:
 *     post:
 *       summary: Register a new user
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserInput'
 *       responses:
 *         '201':
 *           description: User registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User registered successfully"
 *         '400':
 *           description: Bad Request
 *
 *   /api/login:
 *     post:
 *       summary: Login a user or admin
 *       tags:
 *         - Users
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserInput'
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     example: "jwt-token"
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/approve/{userId}:
 *     put:
 *       summary: Approve a user account
 *       tags:
 *         - Admin
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           schema:
 *             type: string
 *           description: ID of the user to approve
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApproveUserInput'
 *       responses:
 *         '200':
 *           description: User approved successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User approved successfully"
 *         '400':
 *           description: Bad Request
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 * 
 *   /api/users:
 *     get:
 *       summary: Get all users
 *       tags:
 *         - Admin
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: A list of all users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/me:
 *     put:
 *       summary: Update profile of the current user
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserInput'
 *       responses:
 *         '200':
 *           description: User profile updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "User profile updated successfully"
 *         '400':
 *           description: Bad Request
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 * 
 *     delete:
 *       summary: Delete the current user's profile
 *       tags:
 *         - Users
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '204':
 *           description: User profile deleted successfully
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 * 
 *    
 * components:
 *   schemas:
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "strongPassword123"
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *             - shared
 *           default: user
 *           example: "user"
 *         isApproved:
 *           type: boolean
 *           default: false
 *           example: false
 *         approvedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "60c72b2f9b1d8e6a5b9f9f91"
 *
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "updateduser@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "newStrongPassword123"
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *             - shared
 *           example: "admin"
 *         isApproved:
 *           type: boolean
 *           example: true
 *         approvedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "60c72b2f9b1d8e6a5b9f9f91"
 *
 *     LoginUserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "password123"
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60c72b2f9b1d8e6a5b9f9f91"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *         role:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *             - shared
 *           example: "user"
 *         isApproved:
 *           type: boolean
 *           example: false
 *         approvedBy:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "60c72b2f9b1d8e6a5b9f9f91"
 *
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Unauthorized"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
