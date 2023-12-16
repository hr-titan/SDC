require('dotenv').config();

const mysql = require('mysql2');

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // host: process.env.DB_HOST
})

connection.connect((err) => {
  if (err) {
    console.log('error connecting to mySQL', err);
    throw err;
  }
  console.log('We are connected!')
})

module.exports = connection;