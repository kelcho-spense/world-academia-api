import { Router } from 'express';
import { getUniversities, getUniversity, createUniversity, updateUniversity, deleteUniversity } from '../controllers/university.controller';
import validateReq from '../middleware/validateResource';
import { createUniversitySchema } from '../schema/university.schema';
import { authMiddleware } from "../middleware/auth.middleware";

const universityRouter: Router = Router();

universityRouter.get('/universities',authMiddleware("admin"), getUniversities); // Get all universities with optional filters
universityRouter.get('/universities/:id',authMiddleware("admin"), getUniversity); // Get a specific university by ID
universityRouter.post('/universities', authMiddleware("admin"), validateReq(createUniversitySchema), createUniversity); // Create a new university (Admin only)
universityRouter.put('/universities/:id', authMiddleware("admin"), validateReq(createUniversitySchema), updateUniversity); // Update a university by ID (Admin only)
universityRouter.delete('/universities/:id', authMiddleware("admin"), deleteUniversity); // Delete a university by ID (Admin only)

export default universityRouter;

/**
 * @openapi
 * paths:
 *   /api/universities:
 *     get:
 *       summary: Get all universities with optional filters
 *       tags:
 *         - Universities
 *       responses:
 *         '200':
 *           description: A list of universities
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateUniversityInput'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *     post:
 *       summary: Create a new university
 *       tags:
 *         - Universities
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         $ref: '#/components/requestBodies/CreateUniversity'
 *       responses:
 *         '201':
 *           description: University created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CreateUniversityInput'
 *         '400':
 *           description: Bad Request
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   /api/universities/{id}:
 *     get:
 *       summary: Get a specific university by ID
 *       tags:
 *         - Universities
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The university ID
 *       responses:
 *         '200':
 *           description: The university data
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/CreateUniversityInput'
 *         '404':
 *           description: University not found
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *     put:
 *       summary: Update a university by ID
 *       tags:
 *         - Universities
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The university ID
 *       requestBody:
 *         $ref: '#/components/requestBodies/CreateUniversity'
 *       responses:
 *         '200':
 *           description: University updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/University'
 *         '400':
 *           description: Bad Request
 *         '404':
 *           description: University not found
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *     delete:
 *       summary: Delete a university by ID
 *       tags:
 *         - Universities
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The university ID
 *       responses:
 *         '204':
 *           description: University deleted successfully
 *         '404':
 *           description: University not found
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *
 *   
 *
 * 
 */
