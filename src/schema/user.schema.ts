import { z, object, string, boolean, enum as zenum, TypeOf, nativeEnum } from 'zod';

// Define a Zod schema for the role field, matching the enum in the Mongoose schema
const UserRoleEnum = zenum(["user", "admin", "shared"]);

// Define the Zod schema for creating a user
export const createUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email format"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password should be at least 6 characters long"),
    role: UserRoleEnum.default("user"),
    isApproved: boolean().optional().default(false),
    approvedBy: string().optional(), // We assume this will be a valid ObjectId (string)
  }),
});

// Define the Zod schema for updating a user
export const updateUserSchema = object({
  body: object({
    email: string().email("Invalid email format").optional(),
    password: string().min(6, "Password should be at least 6 characters long").optional(),
    role: UserRoleEnum.optional(),
    isApproved: boolean().optional(),
    approvedBy: string().optional(), // ObjectId (string) and should only be set by an admin
  }),
});

// Define the Zod schema for user login
export const loginUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email format"),
    password: string({
      required_error: "Password is required",
    }),
  }),
});

// Types for the input validation
export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body'];
export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];

/**
 * @openapi
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
 *           default: user
 *           example: "user"
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
 *     ApproveUserInput:
 *       type: object
 *       required:
 *         - approvedBy        
 *       properties:
 *         approvedBy:
 *           type: string
 *           format: uuid
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
 *   requestBodies:
 *     CreateUser:
 *       description: User object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 * 
 *     UpdateUser:
 *       description: User object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 * 
 *     LoginUser:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserInput'
 */
