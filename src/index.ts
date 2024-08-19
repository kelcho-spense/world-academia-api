import express, { Request, Response, Express } from 'express';
import responseTime from 'response-time';
import config from './config/config';
import limiter from './middleware/rate-limiter'
import dotenv from 'dotenv/config';

import logger from './utils/logger';
import { startMetricsServer, restResponseTimeHistogram } from './utils/metrics';
import connectMongo from './utils/db-connect';

import userRouter from './routes/user.routes';
import universityRouter from './routes/university.routes'
import ingestRouter from './routes/ingest-data.routes'
import swaggerDocs from "./utils/swagger";

const app: Express = express();

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
app.use('/api', userRouter);
app.use('/api', universityRouter);
app.use('/api', ingestRouter)

// app.get('/', (req, res) => {
//     const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
//     // res.send(`Full URL is: ${fullUrl}`);

//     res.status(200).json({ message: "API healthy", fullUrl })
// })

app.get('/', (req, res) => {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    res.send(`
        <html>
            <head>
                <title>world academia</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    h1 { color: #333; }
                    p { margin: 10px 0; }
                    a { color: #1e90ff; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Welcome to World Academia REST API</h1>
                    <p>📚 API Documentation available at: <a href="${fullUrl}docs">${fullUrl}docs</a></p>
                    <p>🎇 Metrics server started at: <a href="${fullUrl}metrics">${fullUrl}metrics</a></p>
                </div>
            </body>
        </html>
    `);
});


// Start the server
app.listen(config.port, () => {
    startMetricsServer(app)
    connectMongo()
    swaggerDocs(app, config.port)
    if (process.env.NODE_ENV == "development") {
        logger.info(`Server running on http://localhost:${config.port}`);
        logger.info(`Docs available at http://localhost:${config.port}/docs`);
        logger.info(`Metrics server started at http://localhost:${config.port}/metrics`);
    } else {
        logger.info(`Server running on port :${config.port}`);
        logger.info(`Docs available at /docs`);
        logger.info("Metrics server started at /metrics");
    }
});
