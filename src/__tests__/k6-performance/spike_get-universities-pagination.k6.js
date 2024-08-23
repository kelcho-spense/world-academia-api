/**
 * to run this test make sure that you have installed k6 in your machine
 * https://grafana.com/docs/k6/latest/set-up/install-k6/
 * 
 * to run this file on your terminal `k6 run get-university-by-id.k6.js`
 */

// Spike Testing
// Goal: Test how the system handles sudden spikes in load.

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 100 }, // spike to 100 users
        { duration: '1m', target: 100 },  // stay at 100 users
        { duration: '10s', target: 500 }, // spike to 500 users
        { duration: '3m', target: 0 },    // ramp down to 0 users
    ],
};

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzJlZjJmNjAzYjRjNDE1MDk0MzEyYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDQwMDc3NiwiZXhwIjoxNzI0NDA0Mzc2fQ.Y2-Z067oXEza5rxkfwK0clRUyh_QmXXZiruYT2q4NuQ'

export default function () {
    const url = `${BASE_URL}/api/universities?page=1&limit=10`;

    const params = {
        headers: {
            'Authorization': AUTH_TOKEN,
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response is an array': (r) => Array.isArray(JSON.parse(r.body).data),
    });

    sleep(1);
}
