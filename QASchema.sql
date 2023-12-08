DROP DATABASE IF EXISTS questionsAnswers;

CREATE DATABASE questionsAnswers;

USE questionsAnswers;

CREATE TABLE questions (
  id INT NOT NULL PRIMARY KEY,
  product_id INT NOT NULL,
  body VARCHAR(255) NOT NULL,
  date_written TIMESTAMP NOT NULL,
  asker_name VARCHAR(255) NOT NULL,
  asker_email VARCHAR(255) NOT NULL,
  reported TINYINT NOT NULL,
  helpful INT
);

CREATE TABLE answers (
  id INT NOT NULL PRIMARY KEY,
  question_id INT NOT NULL,
  body VARCHAR(255),
  date_written TIMESTAMP NOT NULL,
  answerer_name VARCHAR(255) NOT NULL,
  answerer_email VARCHAR(255) NOT NULL,
  reported TINYINT NOT NULL,
  helpful INT NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE photos (
  photo_id INT NOT NULL PRIMARY KEY,
  answer_id INT NOT NULL,
  url VARCHAR(255) NOT NULL,
  FOREIGN KEY (answer_id) REFERENCES answers(id)
);


LOAD DATA INFILE './csvFiles/questions.csv'
INTO TABLE questions
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, product_id, body, @date_written, asker_name, asker_email, reported, helpful)
SET date_written = FROM_UNIXTIME(@date_written / 1000);

LOAD DATA INFILE './csvFiles/answers.csv'
INTO TABLE answers
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, question_id, body, @date_written, answerer_name, answerer_email, reported, helpful)
SET date_written = FROM_UNIXTIME(@date_written / 1000);

LOAD DATA INFILE './csvFiles/answers_photos.csv'
INTO TABLE photos
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(photo_id, answer_id, url);
