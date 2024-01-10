const express = require('express');
const db = require('../db');
const cache = require('memory-cache');

module.exports = {
  getAll: async (req, res) => {
    try {
        const { product_id } = req.query;

        const queryQuestions = `SELECT * FROM questions WHERE product_id = ?`;
        const questionData = await db.promise().query(queryQuestions, [product_id]);

        const answerIds = questionData[0].map(question => question.id);
        const queryAnswers = `SELECT * FROM answers WHERE question_id IN (?)`;
        const answerData = await db.promise().query(queryAnswers, [answerIds]);

        const photoAnswerIds = answerData[0].map(answer => answer.id);
        const queryPhotos = `SELECT * FROM photos WHERE answer_id IN (?)`;
        const photoData = await db.promise().query(queryPhotos, [photoAnswerIds]);


        const result = {
          product_id: product_id,
          questons: questionData[0].map(question => ({
            id: question.id,
            body: question.body,
            date_written: question.date_written,
            asker_name: question.asker_name,
            asker_email: question.asker_email,
            helpful: question.helpful,
            answers: answerData[0]
              .filter(answer => answer.question_id === question.id)
              .map(answer => ({
                id: answer.answer_id,
                question_id: answer.question_id,
                body: answer.body,
                date_written: answer.date_written,
                answerer_name: answer.answerer_name,
                answerer_email: answer.answerer_email,
                reported: answer.reported,
                helpful: answer.helpful,
                photos: photoData[0]
                  .filter(photo => photo.answer_id === answer.id)
                  .map(photo => ({
                    photo_id: photo.photo_id,
                    answer_id: photo.answer_id,
                    url: photo.url
                  }))
              }))
          }))
        };
        console.log('result in dummy: ', result);
        res.json(result);
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
},
  addQuestion: (req, res) => {

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
      if (!results.length) {
        throw err;
      }
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
