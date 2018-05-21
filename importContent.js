const fs = require('fs');
const mysql = require('mysql');

// import site config
const config = require(`./config.json`);

/**
 * Represents an answer to a question of a multiple choice questionnaire.
 */
class Answer {
    constructor(text, id) {
        this.text = text;
        this.id = id;
    }

    insertSelfInDatabase(dbcon, questionID) {
        let localId = this.id;
        let localText = this.text;

        let answerInsertSQL = `INSERT INTO answers(answer_id, answer_string, answer_questioncode)
        VALUES(${localId}, '${localText}', ${questionID})`;

        dbcon.query(answerInsertSQL, function (err, result) {
            if (err) throw err;
            console.log(`1 answer inserted : "${localText}"`);
        });
    }
}

/**
 * Represents a question of a multiple choice questionnaire.
 */
class Question {
    constructor(question, answers, rightAnswer) {
        this.question = question;
        this.answers = answers;
        this.rightAnswer = rightAnswer;
    }

    insertSelfInDatabase(dbcon, sentenceID) {

        let localQuestion = this.question;
        let localRightAnswer = this.rightAnswer;
        let localAnswers = this.answers;

        let questionInsertSQL = `INSERT INTO questions(question_string, question_rightanswer, question_sentencecode)
            VALUES('${localQuestion}', ${localRightAnswer}, ${sentenceID})`;

        dbcon.query(questionInsertSQL, function (err, result) {
            if (err) throw err;
            console.log(`1 question inserted : "${localQuestion}"`);
            let questionID = result.insertId;

            localAnswers.forEach(value => {
                let answer = new Answer(value.text, value.id);
                answer.insertSelfInDatabase(dbcon, questionID);
            });
            /*
            dbcon.query(`SELECT LAST_INSERT_ID() AS last`, function (err, result) {
                if (err) throw err;
                questionID = result[0].last;

                localAnswers.forEach(value => {
                    let answer = new Answer(value.text, value.id);
                    answer.insertSelfInDatabase(dbcon, questionID);
                });
            });*/
        });
    }
}

/**
 * Permits importing sentences in the database.
 */
class DatabaseSentenceInserter {
    constructor(sentence, questions, dbcon) {
        this.sentence = sentence;
        this.questions = questions;
        this.dbcon = dbcon;
    }

    insertSentenceInDatabase() {
        //TODO find something better than sending a query via string
        let localSentence = this.sentence;
        let localQuestions = this.questions;
        let localCon = this.dbcon;

        let sentenceInsertSQL = `INSERT INTO sentences(sentence_string) VALUES('${localSentence}')`;

        // insert the sentence
        localCon.query(sentenceInsertSQL, function (err, result) {
            if (err) throw err;
            console.log(`1 sentence inserted : "${localSentence}"`);

            let insertedSentenceID = result.insertId;
            localCon.query(`SELECT LAST_INSERT_ID() AS last`, function (err, result) {
                if (err) throw err;
                insertedSentenceID = result[0].last;

                localQuestions.forEach(value => {
                    let question = new Question(value.question, value.answers, value.rightAnswer);
                    question.insertSelfInDatabase(localCon, insertedSentenceID);
                });
            });
        });
    }
}

//TODO check args integrity

// remove two first args (node executable and the path to this JS file)
process.argv.shift();
process.argv.shift();

console.log(process.argv);

// has to be 3 args
if (process.argv.length < 3)
    throw 'please use 3 arguments';

// putting parameters in variables
let sentenceJSONFilePath = process.argv.shift();
let graphImageFilePath = process.argv.shift();
let drsImageFilePath = process.argv.shift();

// load JSON file synchronously (no need for async in a standalone data importation tool)
let sentenceJson = JSON.parse(fs.readFileSync(sentenceJSONFilePath));
let sentenceGraphRep = undefined;
let sentenceDRSRep = undefined;

if (fs.existsSync(graphImageFilePath)) {
    sentenceGraphRep = fs.readFileSync(graphImageFilePath);
}
if (fs.existsSync(drsImageFilePath)) {
    sentenceDRSRep = fs.readFileSync(drsImageFilePath);
}

if (sentenceGraphRep === undefined || sentenceDRSRep === undefined)
    throw 'invalid image file paths';

let sentenceString = sentenceJson.sentence;
let sentenceQuestions = sentenceJson.questions;

console.log(sentenceString);
console.log(sentenceQuestions);

// connection to the database
let con = mysql.createConnection({
    host: config.mysql_host,
    user: config.mysql_username,
    password: config.mysql_password,
    database: "visualization",
});

// connect to the database, throw the error if there is one
con.connect(function (err) {
    if (err) throw err;

    console.log("Connected to mysql database.");

    let dbInserter = new DatabaseSentenceInserter(sentenceString, sentenceQuestions, con);
    dbInserter.insertSentenceInDatabase();
    //con.end();
});