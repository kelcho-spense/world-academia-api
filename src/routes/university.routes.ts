import { Router } from 'express';
import { getUniversities, getUniversity, createUniversity, updateUniversity, deleteUniversity } from '../controllers/university.controller';
import validateReq from '../middleware/validateResource';
import { createUniversitySchema } from '../schema/university.schema';
import { authMiddleware } from "../middleware/auth.middleware";

const universityRouter: Router = Router();

universityRouter.get('/universities', getUniversities); // Get all universities with optional filters
universityRouter.get('/universities/:id', getUniversity); // Get a specific university by ID
universityRouter.post('/universities', authMiddleware("admin"), validateReq(createUniversitySchema), createUniversity); // Create a new university (Admin only)
universityRouter.put('/universities/:id', authMiddleware("admin"), validateReq(createUniversitySchema), updateUniversity); // Update a university by ID (Admin only)
universityRouter.delete('/universities/:id', authMiddleware("admin"), deleteUniversity); // Delete a university by ID (Admin only)

export default universityRouter;
