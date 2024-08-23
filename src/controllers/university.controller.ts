import { Request, Response } from 'express';
import University, { IUniversity } from '../models/university.model';

import { withMetrics } from '../utils/metricsUtils';
import { universityFilterUtils, UnknownFilterError  } from '../utils/filterUtils';
//get all universities
export const getUniversities = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = universityFilterUtils(req.query);

    // Pagination parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const universities = await withMetrics("getUniversities", res, () =>
      University.find({
        ...filters,
        ...(filters.country && { country: new RegExp(`^${filters.country}$`, 'i') }),
        ...(filters.continent && { continent: new RegExp(`^${filters.continent}$`, 'i') })
      })
      .skip(skip)
      .limit(limit).lean().exec()
    );

    const total = await University.countDocuments(filters);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: universities,
    });
  } catch (error: any) {
    if (error instanceof UnknownFilterError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Get a specific university by ID

export const getUniversity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const university = await withMetrics("getUniversity", res, () =>
    University.findById(id)
  );

  if (university) {
    res.status(200).json(university);
  } else {
    res.status(404).json({ error: 'University not found' });
  }
};


// Create a new university

export const createUniversity = async (req: Request, res: Response): Promise<void> => {
  const newUniversity: IUniversity = new University(req.body);

  const savedUniversity = await withMetrics("createUniversity", res, () =>
    newUniversity.save()
  );

  if (savedUniversity) {
    res.status(201).json(savedUniversity);
  }
};


// Update a university by ID

export const updateUniversity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const updatedUniversity = await withMetrics("updateUniversity", res, () =>
    University.findByIdAndUpdate(id, req.body, { new: true })
  );

  if (updatedUniversity) {
    res.status(200).json(updatedUniversity);
  } else {
    res.status(404).json({ error: 'University not found' });
  }
};


// Delete a university by ID

export const deleteUniversity = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const deletedUniversity = await withMetrics("deleteUniversity", res, () =>
    University.findByIdAndDelete(id)
  );

  if (deletedUniversity) {
    res.status(200).json({ message: 'University deleted successfully' });
  } else {
    res.status(404).json({ error: 'University not found' });
  }
};

