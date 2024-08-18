import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the University document
export interface IUniversity extends Document {
    country: string;
    alpha_two_code: string;
    domains: string[];
    state_province: string | null;
    web_pages: string[];
    name: string;
    continent: string;
    established_year: number;
    student_population: number;
    programs_offered: string[];
    contact_info: {
        address: string;
        phone: string;
        email: string;
    };
    latitude: number | null;
    longitude: number | null;
}

// Define the University schema
const UniversitySchema: Schema = new Schema({
    country: { type: String, required: true },
    alpha_two_code: { type: String, required: true },
    domains: { type: [String], required: true },
    state_province: { type: String, default: null },
    web_pages: { type: [String], required: true },
    name: { type: String, required: true },
    continent: { type: String, required: true },
    established_year: { type: Number, required: true },
    student_population: { type: Number, required: true },
    programs_offered: { type: [String], required: true },
    contact_info: {
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true }
    },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
});

// Export the University model
export default mongoose.model<IUniversity>('University', UniversitySchema);
