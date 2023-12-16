const express = require('express');
const db = require('../db');

module.exports = {
  getAnswersForAQuestion: (req, res) => {
    const { question_id } = req.query;
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
      } else {
        console.log(results);
        res.json(results);
      }
    })
  },
  addAnswer: (req, res) => {
    let question_id = req.params.question_id;
    let body = req.body.body;
    let date_written = new Date();
    let answerer_name = req.body.name;
    let answerer_email = req.body.email;
    let reported = 0;
    let helpful = 0;
    let photos = req.body.photos.join(',');

    const query = `
      INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

    db.query(query, [question_id, body, date_written, answerer_name, answerer_email, reported, helpful], (err, results) => {
      if (err || !question_id) {
        console.log('error executing query', err)
        res.sendStatus(500).json();
        return;
      } else {
        let answer_id = results.insertId;
        const photoInsertQuery = `INSERT INTO photos (answer_id, url) VALUES (?, ?)`
        db.query(photoInsertQuery, [answer_id, photos], (err, results) => {
          if (err || !answer_id) {
            console.log('error executing query in photos', err)
            res.sendStatus(500);
            return;
          }
        })
        console.log(results);
        res.sendStatus(201);
      }
    })
  },
  markHelpful: (req, res) => {
    console.log('req.params.answer_id: ', req.params.answer_id)
    const query = `
      UPDATE answers a
      SET a.helpful = a.helpful + 1
      WHERE a.id = ?
      `;
    db.query(query, [req.params.answer_id], (err, results) => {
      return err || !req.params.answer_id ? res.sendStatus(500) : res.sendStatus(204);
    })
  },
  reportAnswer: (req, res) => {
      const query = `UPDATE answers a SET a.reported = 1 WHERE a.id = ?`;
      console.log('req.query.answer_id: ', req.query.answer_id)
      db.query(query, [req.params.answer_id], (err, results) => {
        return err || !req.params.answer_id ? res.sendStatus(500) : res.sendStatus(204);
    })
  }
}