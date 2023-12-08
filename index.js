const express = require('express');
const db = require('./db');
const PORT = 3000;

const morgan = require('morgan');
const app = express();

app.use(express.json());

app.get('/qa/questions', (req, res) => {
  const { product_id } = req.params;

  const query = `SELECT q.id, q.body, q.date_written, a.id, a.question_id, a.body, a.date_written FROM questions q INNER JOIN answers a ON q.id=a.question_id LIMIT 10;`

  //comment

  db.query(query, [product_id], (err, results) => {
    if (err) {
      console.log('error executing query', err)
      res.sendStatus(500).json();
      return;
    } else {
      res.send(results).json();
    }
  })
})

app.listen(PORT, () => console.log(`Connection successful. Listening on ${PORT}`))