/**
 * to run this test make sure that you have installed k6 in your machine
 * https://grafana.com/docs/k6/latest/set-up/install-k6/
 * 
 * to run this file on your terminal `k6 run get-university-by-id.k6.js`
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    // vus: 15,
    // duration: '30s',
    stages: [
        { duration: '10s', target: 5 },  // Ramp-up to 5 VUs
        { duration: '20s', target: 15 }, // Hold at 15 VUs
        { duration: '10s', target: 0 },  // Ramp-down to 0 VUs
    ],
    thresholds: {
        http_req_duration: ['p(95)<100'],  // 95% of requests should complete below 100ms
        checks: ['rate>0.95'],            // At least 95% of checks should pass
    },
};

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzJlZjJmNjAzYjRjNDE1MDk0MzEyYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDQwNTIyMCwiZXhwIjoxNzI0NDQ4NDIwfQ.UrBO4JRkV18-AdYtIVcBO0Gse8D5ZkemEmqDEj5U_Wg'

export default function () {
    const url = `${BASE_URL}/api/universities?country=kenya`;

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
