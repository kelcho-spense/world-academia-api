// src/utils/metricsUtils.ts

import { Response } from 'express';
import { databaseResponseTimeHistogram } from './metrics';

export const withMetrics = async <T>(operation: string, res: Response, execFn: () => Promise<T>): Promise<T | void> => {
    const metricsLabels = { operation };
    const timer = databaseResponseTimeHistogram.startTimer();

    try {
        const result = await execFn();
        timer({ ...metricsLabels, success: "true" });
        return result;
    } catch (error: any) {
        timer({ ...metricsLabels, success: "false" });
        res.status(500).json({ error: error.message });
    }
};

export default withMetrics;
