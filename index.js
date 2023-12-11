const express = require('express');
const db = require('./db');
const PORT = 3000;
const questionControllers = require('./controllers/questions.js');
const answersControllers = require('./controllers/answers.js');

const morgan = require('morgan');
const app = express();

app.use(express.json());

app.get('/qa/questions', questionControllers.getAll);
app.post('/qa/questions', questionControllers.addQuestion);
app.put('/qa/questions/:question_id/helpful', questionControllers.markHelpful);
app.put('/qa/questions/:question_id/report', questionControllers.reportQuestion);

app.get('/qa/questions/:question_id/answers', answersControllers.getAnswersForAQuestion);
app.post('/qa/questions/:question_id/answers', answersControllers.addAnswer);
app.put('/qa/answers/:answer_id/helpful', answersControllers.markHelpful);
app.put('/qa/answers/:answer_id/report', answersControllers.reportAnswer);

app.listen(PORT, () => console.log(`Connection successful. Listening on ${PORT}`))