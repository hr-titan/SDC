const express = require('express');
const db = require('./db');
const PORT = 3000;

const morgan = require('morgan');
const app = express();

app.use(express.json());

app.get('/qa/questions', (req, res) => {
  const { product_id } = req.query;

  const query1 = `
    SELECT
      q.product_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', q.id,
          'body', q.body,
          'date_written', q.date_written,
          'asker_name', q.asker_name,
          'asker_email', q.asker_email,
          'helpful', q.helpful,
          'answers', (
            SELECT
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', a.id,
                'question_id', a.question_id,
                'body', a.body,
                'date_written', a.date_written,
                'answerer_name', a.answerer_name,
                'answerer_email', a.answerer_email,
                'reported', a.reported,
                'helpful', a.helpful,
                'photos', (
                  SELECT
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'photo_id', p.photo_id,
                      'answer_id', p.answer_id,
                      'url', p.url
                    )
                  )
                  FROM photos p
                  WHERE a.id = p.answer_id
                )
              )
            )
            FROM answers a
            WHERE a.question_id = q.id
          )
        )
      ) AS questions
    FROM questions q
    WHERE q.product_id=?
    GROUP BY
          q.product_id
      `;

  db.query(query1, [product_id], (err, results) => {
    if (err) {
      console.log('error executing query', err)
      res.sendStatus(500).json();
      return;
    } else {
      console.log(results);
      res.json(results);
    }
  })
})

app.get('/qa/questions/:question_id/answers', (req, res) => {
  const { question_id } = req.query;
  console.log(req.body);

  const query = `
    SELECT
      q.id AS question_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', a.id,
          'question_id', a.question_id,
          'body', a.body,
          'date_written', a.date_written,
          'answerer_name', a.answerer_name,
          'answerer_email', a.answerer_email,
          'reported', a.reported,
          'helpful', a.helpful,
          'photos', (
            SELECT
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'photo_id', p.photo_id,
                'answer_id', p.answer_id,
                'url', p.url
              )
            )
            FROM photos p
            WHERE a.id = p.answer_id
          )
        )
      ) AS answers
      FROM questions q
      INNER JOIN answers a ON q.id = a.question_id
        WHERE q.id = ?
        GROUP BY q.id
      `;

  db.query(query, [question_id], (err, results) => {
    if (err) {
      console.log('error executing query', err)
      res.sendStatus(500).json();
      return;
    } else {
      console.log(results);
      res.json(results);
    }
  })
})



app.listen(PORT, () => console.log(`Connection successful. Listening on ${PORT}`))