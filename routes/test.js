const express = require('express');
const session = require('express-session');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);

const fs = require('fs');

function getRandomQuestionFromDatabase(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM questions ORDER BY RAND() LIMIT 1", function (err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getAnswersFromDatabse(dbCon, codeQuestion) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM answers WHERE answers.answer_questioncode = " + codeQuestion, function (err, result2, fields) {
            if (err) reject(err);
            console.log(result2);
            resolve(result2);
        });
    });
}

/**
 * GET home page
 */
router.get('/', function (req, res, next) {
    res.render('contribute', {
        title: 'MR Test',
        current: 'test',
    });
});

router.get('/test', function (req, res, next) {
    //session count page
    if (typeof req.session.view === 'undefined') {
        req.session.view = 1;
    } else {
        req.session.view++;
    }

    if (req.session.view <= 10) {
        let questions;

        let con = mysql.createConnection({
            host: config.mysql_host,
            user: config.mysql_username,
            password: config.mysql_password,
            database: "visualization"
        });

        let randomQuestion = "";
        let questionObject;
        let answers = [];
        let visualization;

        getRandomQuestionFromDatabase(con).then(sentenceResult => {
            randomQuestion = sentenceResult[0].question_string;
            questionObject = sentenceResult[0];
        }).then(() => {
            return getAnswersFromDatabse(con, questionObject.question_code).then(answersResult => {
                answers = answersResult;
            });
        }).then(() => {
            res.render('test', {
                questions: questions,
                question: randomQuestion,
                answer1: answers[0].answer_string,
                answer2: answers[1].answer_string,
                answer3: answers[2].answer_string,
                title: 'MR Test',
                current: 'test',
                number_test: req.session.view,
            });
        }).catch();
    }
    else {
        req.session.view = 0;
        res.redirect("/thanks/")
    }

});

module.exports = router;