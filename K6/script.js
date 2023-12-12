import http from 'k6/http';
import { check, sleep } from "k6";

export const options = {
  // Key configurations for Stress in this section
  stages: [
    { duration: '10s', target: 500 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: '15s', target: 1000 }, // stay at higher 200 users for 30 minutes
    { duration: '5s', target: 0 }, // ramp-down to 0 users
  ],
};

export default function () {
  const random1 = Math.floor((Math.random() * 900000))
  const res1 = http.get(`http://localhost:3000/qa/questions?product_id=${random1}`);
  sleep(1);

  // const random2 = Math.floor((Math.random() * 900000))
  // const res2 = http.get(`http://localhost:3000/qa/questions/:question_id/answers?question_id=${random2}`);
  // sleep(1);
}