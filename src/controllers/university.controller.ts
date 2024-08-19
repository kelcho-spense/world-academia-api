import { Request, Response } from 'express';
import University, { IUniversity } from '../models/university.model';
import { databaseResponseTimeHistogram } from "../utils/metrics";


export const getUniversities = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "getUniversities",
  };
  const timer = databaseResponseTimeHistogram.startTimer();

  const { country, continent, name, established_year, program } = req.query;
  const filters: any = {};

  // Build query filters based on request parameters
  if (country) filters.country = (country as string).toLowerCase();
  if (continent) filters.continent = (continent as string).toLowerCase();
  if (name) filters.name = new RegExp((name as string).toLowerCase(), 'i'); // Case-insensitive name search
  if (established_year) filters.established_year = established_year;
  if (program) filters.programs_offered = { $regex: new RegExp((program as string).toLowerCase(), 'i') }; // Case-insensitive program search

  try {
    const universities = await University.find({
      ...filters,
      ...(filters.country && { country: new RegExp(`^${filters.country}$`, 'i') }), // Ensure case-insensitivity for country
      ...(filters.continent && { continent: new RegExp(`^${filters.continent}$`, 'i') }) // Ensure case-insensitivity for continent
    });
    timer({ ...metricsLabels, success: "true" });
    res.status(200).json(universities);
  } catch (error: any) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error.message });
  }
};


// Get a specific university by ID
export const getUniversity = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "getUniversity",
  };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const { id } = req.params;
    const university = await University.findById(id);
    timer({ ...metricsLabels, success: "true" });

    if (!university) {
      res.status(404).json({ error: 'University not found' });
      return;
    }

    res.status(200).json(university);
  } catch (error: any) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error.message });
  }
};

// Create a new university
export const createUniversity = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "createUniversity",
  };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const newUniversity: IUniversity = new University(req.body);
    const savedUniversity = await newUniversity.save();
    timer({ ...metricsLabels, success: "true" });
    res.status(201).json(savedUniversity);
  } catch (error: any) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error.message });
  }
};

// Update a university by ID
export const updateUniversity = async (req: Request, res: Response): Promise<void> => {
  const metricsLabels = {
    operation: "updateUniversity",
  };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const { id } = req.params;

    const updatedUniversity = await University.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedUniversity) {
      res.status(404).json({ error: 'University not found' });
      return;
    }
    timer({ ...metricsLabels, success: "true" });
    res.status(200).json(updatedUniversity);
  } catch (error: any) {
    timer({ ...metricsLabels, success: "false" });
    res.status(500).json({ error: error.message });
  }
};

// Delete a university by ID
export const deleteUniversity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedUniversity = await University.findByIdAndDelete(id);

    if (!deletedUniversity) {
      res.status(404).json({ error: 'University not found' });
      return;
    }

    res.status(200).json({ message: 'University deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
