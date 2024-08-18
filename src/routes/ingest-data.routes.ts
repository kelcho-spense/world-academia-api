import express from 'express';
import { ingestOneFile, ingestAllFiles } from '../controllers/ingest.controller';

const ingestRouter = express.Router();

// Route to handle data ingestion
ingestRouter.get('/ingest', ingestOneFile);
// Route to handle ingestion of all files
ingestRouter.get('/ingest/all', ingestAllFiles);

export default ingestRouter;
