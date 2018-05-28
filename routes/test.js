const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);

function getRandomQuestionFromDatabase(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query(`SELECT * FROM questions ORDER BY RAND() LIMIT 1`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getAnswersFromDatabase(dbCon, codeQuestion) {
    return new Promise((resolve, reject) => {
        dbCon.query(`SELECT * FROM answers WHERE answers.answer_questioncode = ${codeQuestion}`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

/**
 * GET home page
 */
router.get('/', (req, res) => {
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
    let questionCode = -1;
    let answers = [];

    getRandomQuestionFromDatabase(con).then(sentenceResult => {
        randomQuestion = sentenceResult[0].question_string;
        questionCode = sentenceResult[0].question_code;
        req.session.questionObject = sentenceResult[0];
    }).then(() => {
        return getAnswersFromDatabase(con, req.session.questionObject.question_code).then(answersResult => {
            answers = answersResult;
        });
    }).then(() => {
        let rand = Math.floor((Math.random() * 2) + 1);
        res.render('test', {
            questions: questions,
            question: randomQuestion,
            question_code: questionCode,
            answer1: answers[0].answer_string,
            answer2: answers[1].answer_string,
            answer3: answers[2].answer_string,
            title: 'MR Test',
            current: 'test',
            number_test: req.session.testStage,
            code_sentence: req.session.questionObject.question_sentencecode,
            visualization_code: rand,
        });
    }).catch();
}

router.post('/test', (req, res) => {
    updateTestStage(req, false);
    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });

    let isright;

    if(req.body.answer == req.session.questionObject.question_rightanswer){
        isright = 'yes';
    }
    else{
        isright = 'no';
    }

    con.query('INSERT INTO results (results_isright, results_visualizationtype, results_questioncode) VALUES (' + isright + ', ' + req.body.representationtype + ', ' + req.body.code_question +  ')');

    if (req.session.testStage > 10) {
        req.session.testStage = 0;
        res.redirect("/thanks/")
    }
    else {
        renderQuestionPage(res, req);
    }
});

router.get('/test', (req, res) => {
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