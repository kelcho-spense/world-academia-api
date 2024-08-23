/**
 * to run this test make sure that you have installed k6 in your machine
 * https://grafana.com/docs/k6/latest/set-up/install-k6/
 * 
 * to run this file on your terminal `k6 run get-university-by-id.k6.js`
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 25,
    duration: '30s',
};

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzJlZjJmNjAzYjRjNDE1MDk0MzEyYyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNDQwMDc3NiwiZXhwIjoxNzI0NDA0Mzc2fQ.Y2-Z067oXEza5rxkfwK0clRUyh_QmXXZiruYT2q4NuQ'

export default function () {
    const universityId = '66c261d71d8197461b51577b'; // Replace with an actual university ID from your database
    const url = `${BASE_URL}/api/universities/${universityId}`;

    const params = {
        headers: {
            'Authorization': AUTH_TOKEN,
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        // 'response contains university': (r) => JSON.parse(r.body)._id === universityId,
    });

    sleep(1);
}
