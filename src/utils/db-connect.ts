import mongoose from 'mongoose'
import logger from './logger'
import config from '../config/config';


export default function connectMongo() {
    // Database Connection
    mongoose
        .connect(config.mongoUri)
        .then(() => logger.info('Connected to MongoDB'))
        .catch((error) => logger.error('MongoDB connection error:', error));
}

