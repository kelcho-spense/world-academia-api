// src/index.ts
import express, { Application, Request, Response } from 'express';
import responseTime from 'response-time';
import config from './config/config';
import logger from './utils/logger';
import { startMetricsServer, restResponseTimeHistogram } from './utils/metrics';
import connectMongo from './utils/db-connect';
import limiter from './middleware/rate-limiter'

import todoRoutes from './routes/todo.routes';
import userRouter from './routes/user.routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(responseTime(
    (req: Request, res: Response, time: number) => {
        if (req?.route?.path) {
            restResponseTimeHistogram.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    status_code: res.statusCode,
                },
                time * 1000
            );
        }
    })
);

// Routes
app.use('/api', todoRoutes);
app.use('/api/auth', userRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: "API healthy" })
})


// Start the server
app.listen(config.port, () => {
    startMetricsServer()
    connectMongo()
    logger.info(`Server running on port ${config.port}`);
});
