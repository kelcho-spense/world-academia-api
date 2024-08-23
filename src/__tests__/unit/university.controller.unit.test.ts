// src/tests/university.controller.unit.test.ts

import { getUniversity, createUniversity } from '../../controllers/university.controller';
import { Request, Response } from 'express';
import University from '../../models/university.model';

jest.mock('../../models/university.model');

describe('University Controller - Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn(() => ({ json: mockJson }));
    res = { status: mockStatus } as Partial<Response>;
  });

//   it('should create a university and return 201', async () => {
//     req = {
//       body: {
//         name: 'Test University',
//         country: 'Testland',
//         alpha_two_code: 'TL',
//         domains: ['test.edu'],
//         web_pages: ['http://www.test.edu'],
//         continent: 'Test Continent',
//         established_year: 1990,
//         student_population: 5000,
//         programs_offered: ['Engineering', 'Arts'],
//         contact_info: {
//           address: '123 Test St, Test City, Testland',
//           phone: '+1-123-456-7890',
//           email: 'info@test.edu',
//         },
//       },
//     };

//     (University.create as jest.Mock).mockResolvedValue(req.body);

//     await createUniversity(req as Request, res as Response);

//     expect(res.status).toHaveBeenCalledWith(201);
//     // expect(res.status(201).json).toHaveBeenCalledWith(req.body);
//   });

  it('should return 404 if university not found', async () => {
    req = { params: { id: 'nonexistentid' } };
    (University.findById as jest.Mock).mockResolvedValue(null);

    await getUniversity(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    // expect(res.status(404).json).toHaveBeenCalledWith({ error: 'University not found' });
  });
});
