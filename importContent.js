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

    insertSelfInDatabase(dbCon, questionID) {
        let localId = this.id;
        let localText = this.text;

        let answerInsertSQL = `INSERT INTO answers(answer_id, answer_string, answer_questioncode)
        VALUES(${localId}, '${localText}', ${questionID})`;

        dbCon.query(answerInsertSQL, err => {
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
        this.answers = [];
        this.rightAnswer = rightAnswer;
        answers.forEach(value => {
            this.answers.push(new Answer(value.text, value.id));
        }, this)
    }

    insertSelfInDatabase(dbCon, sentenceID) {
        let localQuestion = this.question;
        let localRightAnswer = this.rightAnswer;
        return new Promise((resolve, reject) => {
            let questionInsertSQL = `INSERT INTO questions(question_string, question_rightanswer, question_sentencecode)
            VALUES('${localQuestion}', ${localRightAnswer}, ${sentenceID})`;

            dbCon.query(questionInsertSQL, (err, result) => {
                if (err) return reject(err);
                console.log(`1 question inserted : "${localQuestion}"`);
                resolve(result);
            })
        });
    }
}

class Sentence {
    constructor(sentence, questions) {
        this.sentence = sentence;
        this.questions = [];
        questions.forEach(value => {
            this.questions.push(new Question(value.question, value.answers, value.rightAnswer));
        }, this);
    }

    insertSelfInDatabase(dbCon) {
        let localSentence = this.sentence;
        return new Promise((resolve, reject) => {
            let sentenceInsertSQl = `INSERT INTO sentences(sentence_string)
            VALUES('${localSentence}')`;

            dbCon.query(sentenceInsertSQl, (err, result) => {
                if (err) return reject(err);
                console.log(`1 sentence inserted : "${localSentence}"`);
                resolve(result);
            });
        });
    }
}

function insertBoxInDataBase(boxImage, sentenceID, dbCon) {
    let insertBoxImageSQL = `INSERT INTO boximages SET ?`;
    let values = {
        boximage_image: boxImage,
        boximage_sentencecode: sentenceID,
    };
    return new Promise((resolve, reject) => {
        dbCon.query(insertBoxImageSQL, values, (err, result) => {
            if (err) return reject(err);
            console.log(`box image inserted.`);
            resolve(result);
        });
    });
}

function insertGraphInDataBase(graphImage, sentenceID, dbCon) {
    let insertBoxImageSQL = `INSERT INTO graphimages SET ?`;
    let values = {
        graphimage_image: graphImage,
        graphimage_sentencecode: sentenceID,
    };
    return new Promise((resolve, reject) => {
        dbCon.query(insertBoxImageSQL, values, (err, result) => {
            if (err) return reject(err);
            console.log(`graph image inserted.`);
            resolve(result);
        });
    });
}

// remove two first args (node executable and the path to this JS file)
process.argv.shift();
process.argv.shift();

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

if (!sentenceGraphRep.toString('hex').startsWith('89504e470d0a1a0a') || !sentenceDRSRep.toString('hex').startsWith('89504e470d0a1a0a'))
    throw 'wrong image format, use PNG';

let sentenceString = sentenceJson.sentence;
let sentenceQuestions = sentenceJson.questions;

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
    /*
    insert sentence->promise->then while there are questions->insert question->promise then insert answers->wait for all
    */
    let insertSentence = new Sentence(sentenceString, sentenceQuestions);
    let sentenceInsertPromises = [];
    let imageInsertPromises = [];
    let sentenceId;
    insertSentence.insertSelfInDatabase(con)
        .then(sentenceInsertResult => {
            sentenceId = sentenceInsertResult.insertId;
            insertSentence.questions.forEach(question => {
                let actualQuestion = question;
                sentenceInsertPromises.push(actualQuestion.insertSelfInDatabase(con, sentenceId)
                    .then(questionInsertResult => {
                        let questionId = questionInsertResult.insertId;
                        actualQuestion.answers.forEach(answer => {
                            answer.insertSelfInDatabase(con, questionId);
                        })
                    }));
            });
            return Promise.all(sentenceInsertPromises);
        }).then(() => {
        imageInsertPromises.push(insertGraphInDataBase(sentenceGraphRep, sentenceId, con));
        imageInsertPromises.push(insertBoxInDataBase(sentenceDRSRep, sentenceId, con));
        return Promise.all(imageInsertPromises);
    }).then(() => {
        con.end();
    }).catch(reason => {
        con.end();
        throw reason;
    });
});