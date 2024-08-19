import { z, object, string, array, number, nullable } from 'zod';

export const createUniversitySchema = object({
    body: object({
        country: string({
            required_error: "Country is required",
        }),
        alpha_two_code: string({
            required_error: "Alpha two code is required",
        }).length(2, "Alpha two code must be exactly 2 characters"),
        domains: array(string({
            required_error: "Domain is required",
        })).nonempty({
            message: "At least one domain is required",
        }),
        state_province: string().nullable().optional(), // Nullable and optional
        web_pages: array(string({
            required_error: "At least one web page is required",
        })).nonempty({
            message: "At least one web page is required",
        }),
        name: string({
            required_error: "Name is required",
        }),
        continent: string({
            required_error: "Continent is required",
        }),
        established_year: number({
            required_error: "Established year is required",
        }).min(1000, "Established year must be after 1000 AD").max(new Date().getFullYear(), `Established year cannot be in the future`),
        student_population: number({
            required_error: "Student population is required",
        }).positive("Student population must be a positive number"),

        programs_offered: array(string({
            required_error: "Program is required",
        })).nonempty({
            message: "At least one program is required",
        }),
        contact_info: object({
            address: string({
                required_error: "Address is required",
            }),
            phone: string({
                required_error: "Phone number is required",
            }),
            email: string({
                required_error: "Email is required",
            }).email("Invalid email format"),
        }).optional(),
        latitude: number().nullable().optional(), // Nullable and optional
        longitude: number().nullable().optional(), // Nullable and optional
    }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUniversityInput:
 *       type: object
 *       required:
 *         - country
 *         - alpha_two_code
 *         - domains
 *         - web_pages
 *         - name
 *         - continent
 *         - established_year
 *         - student_population
 *         - programs_offered
 *       properties:
 *         country:
 *           type: string
 *           example: "United States"
 *         alpha_two_code:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           example: "US"
 *         domains:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           example: ["example.edu"]
 *         state_province:
 *           type: string
 *           nullable: true
 *           example: "California"
 *         web_pages:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           example: ["http://www.example.edu"]
 *         name:
 *           type: string
 *           example: "Example University"
 *         continent:
 *           type: string
 *           example: "North America"
 *         established_year:
 *           type: integer
 *           minimum: 1000
 *           maximum: 2024  # Assuming the current year
 *           example: 1850
 *         student_population:
 *           type: integer
 *           minimum: 1
 *           example: 15000
 *         programs_offered:
 *           type: array
 *           items:
 *             type: string
 *           minItems: 1
 *           example: ["Computer Science", "Engineering"]
 *         contact_info:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               example: "123 University Ave, City, Country"
 *             phone:
 *               type: string
 *               example: "+1-234-567-890"
 *             email:
 *               type: string
 *               format: email
 *               example: "info@example.edu"
 *           required:
 *             - address
 *             - phone
 *             - email
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 37.7749
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: -122.4194
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
 *     CreateUniversity:
 *       description: University object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUniversityInput'
 */
