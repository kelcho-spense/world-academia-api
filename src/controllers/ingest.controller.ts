import { Request, Response } from 'express';
import University, { IUniversity } from '../models/university.model';
import path from 'path';
import fs from 'fs/promises';
import { databaseResponseTimeHistogram } from "../utils/metrics";

export const ingestOneFile = async (req: Request, res: Response): Promise<void> => {
    const metricsLabels = {
        operation: "ingestOneFile",
    };
    const timer = databaseResponseTimeHistogram.startTimer();

    const { file } = req.query;

    if (!file) {
        res.status(400).json({ error: 'File query parameter is required' });
        return;
    }

    try {
        // Define the path to the data folder and file
        const filePath = path.join(__dirname, '..', 'data', `${file}.json`);

        // Read the JSON file
        const data = await fs.readFile(filePath, 'utf-8');
        const universities = JSON.parse(data);

        // Pass the data to the service for ingestion
        const { insertedCount, skippedCount } = await persistOneUniversityData(universities);
        timer({ ...metricsLabels, success: "true" });
        res.status(200).json({ message: 'Data ingestion complete', insertedCount, skippedCount });
    } catch (error: any) {
        timer({ ...metricsLabels, success: "false" });
        res.status(500).json({ error: error.message });
    }
};

export const persistOneUniversityData = async (universities: IUniversity[]) => {
    let insertedCount = 0;
    let skippedCount = 0;

    for (const university of universities) {
        // Check if a university with the same email already exists
        const existingUniversity = await University.findOne({ 'contact_info.email': university.contact_info.email });

        if (!existingUniversity) {
            // Insert the new university record
            await University.create(university);
            insertedCount++;
        } else {
            skippedCount++;
        }
    }

    return { insertedCount, skippedCount };
};

export const ingestAllFiles = async (req: Request, res: Response): Promise<void> => {
    const metricsLabels = {
        operation: "ingestAllFiles",
    };
    const timer = databaseResponseTimeHistogram.startTimer();
    const dataDir = path.join(__dirname, '..', 'data');

    try {
        // Read all files in the data directory
        const files = await fs.readdir(dataDir);

        let totalInserted = 0;
        let totalSkipped = 0;
        const results: Array<{ fileName: string; insertedCount: number; skippedCount: number }> = [];

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const data = await fs.readFile(filePath, 'utf-8');
            const universities = JSON.parse(data);

            // Ingest data from the current file
            const { insertedCount, skippedCount } = await persistAllUniversityData(universities);

            totalInserted += insertedCount;
            totalSkipped += skippedCount;

            results.push({
                fileName: file,
                insertedCount,
                skippedCount
            });
        }
        timer({ ...metricsLabels, success: "true" });

        res.status(200).json({
            message: 'Data ingestion from all files complete',
            totalInserted,
            totalSkipped,
            results
        });
    } catch (error: any) {
        timer({ ...metricsLabels, success: "false" });
        res.status(500).json({ error: error.message });
    }
};

export const persistAllUniversityData = async (universities: IUniversity[]) => {
    let insertedCount = 0;
    let skippedCount = 0;

    for (const university of universities) {
        // Check if a university with the same email already exists
        const existingUniversity = await University.findOne({ 'contact_info.email': university.contact_info.email });

        if (!existingUniversity) {
            // Insert the new university record
            await University.create(university);
            insertedCount++;
        } else {
            skippedCount++;
        }
    }

    return { insertedCount, skippedCount };
};
