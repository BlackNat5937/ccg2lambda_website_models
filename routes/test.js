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
        dbCon.query("SELECT * FROM answers WHERE answers.answer_questioncode = " + codeQuestion, function (err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

/**
 * GET home page
 */
router.get('/', (req, res, next) => {
    res.render('contribute', {
        title: 'MR Test',
        current: 'test',
    });
});

function updateTestStage(req, isGet) {
    if (typeof req.session.testStage === 'undefined') {
        req.session.testStage = 1;
    } else {
        req.session.testStage++;
    }
    if (isGet === true)
        req.session.testStage = 1;
}

function renderQuestionPage(res, req) {
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
            number_test: req.session.testStage,
        });
    }).catch();
}

router.post('/test', (req, res, next) => {
    updateTestStage(req, false);

    if (req.session.testStage > 10) {
        req.session.testStage = 0;
        res.redirect("/thanks/")
    }
    else {
        renderQuestionPage(res, req);
    }
});

router.get('/test', (req, res, next) => {
    //session count page
    updateTestStage(req, true);

    if (req.session.testStage > 10) {
        req.session.testStage = 0;
        res.redirect("/thanks/")
    }
    else {
        renderQuestionPage(res, req);
    }
});

module.exports = router;