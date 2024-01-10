const express = require('express');
const db = require('../db');
const cache = require('memory-cache');

module.exports = {
  getAll: (req, res) => {
    const { product_id } = req.query;
	const cacheKey = JSON.stringify(req.query);
	  const cachedData = cache.get(cacheKey);

	if (cachedData) {
		console.log('in the cache----')
      	  res.json(cachedData);
      	  return;
   	 };
	  
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
        return res.sendStatus(500);
      } else {      
	cache.put(cacheKey, results, 1000);
	res.json(results);
      }
    })
  },
  addQuestion: (req, res) => {
    //query for checking after postman POST:
    // SELECT * FROM questions WHERE questions.product_id = <product_id entered in req body> ORDER BY questions.id DESC LIMIT 10;

    let product_id = req.body.product_id;
    let body = req.body.body;
    let date_written = new Date();
    let asker_name = req.body.asker_name;
    let asker_email = req.body.asker_email;
    let reported = 0;
    let helpful = 0;


    const query = `
      INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    db.query(query, [product_id, body, date_written, asker_name, asker_email, reported, helpful], (err, results) => {
      if (err) {
        console.log('error executing query', err)
        res.sendStatus(500).json();
        return;
      } else {
        console.log('results: ', results.insertId);
        res.sendStatus(200);
      }
    })
  },
  markHelpful: (req, res) => {
    const query = `
      UPDATE questions q
      SET q.helpful = q.helpful + 1
      WHERE q.id = ?
      `;
      // console.log(req.params.question_id);
    db.query(query, [req.params.question_id], (err, results) =>{
      if (err) {
        console.log('error updating helpful in questions: ', err)
        res.sendStatus(500);
      } else {
        console.log(results);
        res.sendStatus(201);
      }
    })
  },
  reportQuestion: (req, res) => {
    const query = `
      UPDATE questions q
      SET q.reported = 1
      WHERE q.id = ?
      `;
      console.log(req.params.question_id)
    db.query(query, [req.params.question_id], (err, results) =>{
      if (err) {
        console.log('Error marking report in questions: ', err)
        res.sendStatus(500);
      } else {
        console.log(results);
        res.sendStatus(204);
      }
    })
  }
}
