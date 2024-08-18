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
