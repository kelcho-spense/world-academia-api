import request from 'supertest';
import  app  from '../../app';
import mongoose from 'mongoose';

describe('University API - E2E Tests with Authorization', () => {
  const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzJlZjJmNjAzYjRjNDE1MDk0MzEyYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDA1MTI1NCwiZXhwIjoxNzI0MDU0ODU0fQ.d8R4oRCmmrvTBHqC2olom6mseR0Ce-B-enNYjMBl2dI';

//   it('should create a new university with authorization', async () => {
//     const response = await request(app)
//       .post('/api/universities')
//       .set('Authorization', authToken)
//       .send({
//         country: 'United Kingdom',
//         alpha_two_code: 'GB',
//         domains: ['myport.ac.uk', 'myport.port.ac.uk'],
//         state_province: null,
//         web_pages: ['https://myport.port.ac.uk'],
//         name: 'University of Portsmouth',
//         continent: 'Europe',
//         established_year: 1992,
//         student_population: 25000,
//         programs_offered: [
//           'Computer Science',
//           'Business Administration',
//           'Mechanical Engineering',
//         ],
//         contact_info: {
//           address: 'Winston Churchill Avenue, Portsmouth, PO1 2UP, UK',
//           phone: '+44 23 9284 8484',
//           email: 'info@port.ac.uk',
//         },
//         latitude: 50.7984,
//         longitude: -1.0974,
//       })
//       .expect(201);

//     expect(response.body).toHaveProperty('_id');
//     expect(response.body.name).toBe('University of Portsmouth');
//   });

  it('should get a list of universities', async () => {
    const response = await request(app)
      .get('/api/universities')
      .set('Authorization', authToken)
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.page).toBe(1);
  });

  it('should return 404 for a non-existent university', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await request(app)
      .get(`/api/universities/${nonExistentId}`)
      .set('Authorization', authToken)
      .expect(404);
  });
});
