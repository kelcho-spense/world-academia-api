import app from './app';  // Import the app instance
import config from './config/config';
import { startMetricsServer } from './utils/metrics';
import connectMongo from './utils/db-connect';
import swaggerDocs from "./utils/swagger";
import logger from './utils/logger';

// Start the server
app.listen(config.port, () => {
    startMetricsServer(app);
    connectMongo();
    swaggerDocs(app, config.port);

    if (process.env.NODE_ENV === "development") {
        logger.info(`Server running on http://localhost:${config.port}`);
        logger.info(`Docs available at http://localhost:${config.port}/docs`);
        logger.info(`Metrics server started at http://localhost:${config.port}/metrics`);
    } else {
        logger.info(`Server running on port :${config.port}`);
        logger.info(`Docs available at /docs`);
        logger.info("Metrics server started at /metrics");
    }
});
