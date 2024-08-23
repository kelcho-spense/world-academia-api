/**
 * to run this test make sure that you have installed k6 in your machine
 * https://grafana.com/docs/k6/latest/set-up/install-k6/
 * 
 * to run this file on your terminal `k6 run get-university-by-id.k6.js`
 */

// Stress Testing
// Goal: Identify the system's breaking point by gradually increasing the load until the system fails.

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 100 }, // ramp up to 100 users
        { duration: '3m', target: 200 }, // stay at 200 users
        { duration: '2m', target: 300 }, // ramp up to 300 users
        { duration: '2m', target: 400 }, // ramp up to 400 users
        { duration: '4m', target: 500 }, // stay at 500 users (potentially beyond system capacity)
        { duration: '2m', target: 0 },   // ramp down to 0 users
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
