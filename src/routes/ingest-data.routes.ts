import express from 'express';
import { ingestOneFile, ingestAllFiles } from '../controllers/ingest.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const ingestRouter = express.Router();

// Route to handle data ingestion
ingestRouter.get('/ingest',authMiddleware("admin"), ingestOneFile);
// Route to handle ingestion of all files
ingestRouter.get('/ingest/all',authMiddleware("admin"), ingestAllFiles);

export default ingestRouter;

/**
 * @openapi
 * paths:
 *   /api/ingest:
 *     get:
 *       summary: Read university data from a file and save them to the database
 *       tags:
 *         - Ingestion
 *       parameters:
 *         - in: query
 *           name: file
 *           schema:
 *             type: string
 *           required: true
 *           description: The name of the file to ingest (e.g., "kenya").
 *       responses:
 *         '200':
 *           description: File ingested successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "File ingested successfully"
 *                   data:
 *                     type: object
 *                     description: Information about the ingested file.
 *         '400':
 *           description: Bad Request - Missing or invalid file parameter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Invalid or missing file parameter"
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Internal Server Error"
 *
 *   /api/ingest/all:
 *     get:
 *       summary: Read university data from a files and save them to the database
 *       tags:
 *         - Ingestion
 *       responses:
 *         '200':
 *           description: All files ingested successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "All files ingested successfully"
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       description: Information about each ingested file.
 *         '500':
 *           description: Server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: "Internal Server Error"
 */
