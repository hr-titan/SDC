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
  //GET all data
  let min = 500000;
  let max = 800000;
  // const random1 = Math.floor((Math.random() * (max - min) + min));
  // const res1 = http.get(`http://localhost:3000/qa/questions?product_id=${random1}`);
  // sleep(1);

  //GET all answers
  // const random2 = Math.floor((Math.random() * (max - min) + min));
  // const res2 = http.get(`http://localhost:3000/qa/questions/:question_id/answers?question_id=${random2}`);
  // sleep(1);

  // POST add question
  // const random3 = Math.floor((Math.random() * (max - min) + min));
  // const params = {
  //   "body": "What is this, a rubber duck?",
  //   "asker_name": "Rubber Ducky",
  //   "asker_email": "name@name.com",
  //   "product_id": random3
  // };
  // const res3 = http.post(`http://localhost:3000/qa/questions`);
  // sleep(1);

  //Add Answer
// const random4 = Math.floor((Math.random() * (max - min) + min));
//   const params = {
//     "body": "Yes it is. Squeak squeak?",
//     "name": "Ducky Answerer",
//     "email": "name@name.com",
//     "photos": ["https://images.app.goo.gl/PFGMSE758jsrrBe29", "https://images.app.goo.gl/hbgjaCYEnisVYK6XA"]
//   };
//   const res4 = http.post(`http://localhost:3000/qa/questions/${random4}/answers`, params);
//   sleep(1);


  //Mark question helpful
  // const random5 = Math.floor((Math.random() * (max - min) + min));
  // const res5 = http.put(`http://localhost:3000/qa/questions/${random5}/helpful`);
  // sleep(1);

  //report question
  // const random6 = Math.floor((Math.random() * (max - min) + min));
  // const res6 = http.put(`http://localhost:3000/qa/questions/${random6}/report`);
  // sleep(1);


  //Mark answer helpful
  // const random7 = Math.floor((Math.random() * (200000 - 100000) + 100000));
  // const res5 = http.put(`http://localhost:3000/qa/answers/${random7}/helpful`);
  // sleep(1);

  //mark report answer
  const random8 = Math.floor((Math.random() * (200000 - 100000) + 100000));
  const res5 = http.put(`http://localhost:3000/qa/answers/${random8}/report`);
  sleep(1);
}