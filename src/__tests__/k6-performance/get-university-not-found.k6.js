/**
 * to run this test make sure that you have installed k6 in your machine
 * https://grafana.com/docs/k6/latest/set-up/install-k6/
 * 
 * to run this file on your terminal `k6 run get-university-by-id.k6.js`
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20,
    duration: '30s',
};

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzJlZjJmNjAzYjRjNDE1MDk0MzEyYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDQwMDc3NiwiZXhwIjoxNzI0NDA0Mzc2fQ.Y2-Z067oXEza5rxkfwK0clRUyh_QmXXZiruYT2q4NuQ'

export default function () {
    const nonExistentId = '000000000000000000000000'; // An ID that doesn't exist in your database
    const url = `${BASE_URL}/api/universities/${nonExistentId}`;

    const params = {
        headers: {
            'Authorization': AUTH_TOKEN,
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 404': (r) => r.status === 404,
        'error message is correct': (r) => JSON.parse(r.body).error === 'University not found',
    });

    sleep(1);
}
