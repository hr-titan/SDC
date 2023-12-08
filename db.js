const mysql = require('mysql2');

const connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'questionsAnswers',
})

connection.connect((err) => {
  if (err) {
    console.log('error connecting to mySQL', err);
    throw err;
  }
  console.log('We are connected!')
})

module.exports = connection;