const express = require('express');
const session = require('express-session');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);

const fs = require('fs');

function getDB(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM questions ORDER BY RAND() LIMIT 1", function (err, result, fields) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getAnswersDB(dbCon, codeQuestion){
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
    if(typeof req.session.view === 'undefined'){
        req.session.view = 1;
    }else{
        req.session.view ++;
    }
    
    if(req.session.view <= 10){
        let questions;
    
        let con = mysql.createConnection({
            host: config.mysql_host,
            user: config.mysql_username,
            password: config.mysql_password,
            database: "visualization"
        });
    
        let random_question = "";
        let object_question;
        let answer = "";
    
        getDB(con).then(result => {
            random_question = result[0].question_string;
            object_question = result[0];
            //con.end();
        }).then(()=>{
            return getAnswersDB(con, object_question.question_code).then(result2 => {
                console.log("Code " + object_question.question_code)
                answer = result2;
            });
        }).then(()=>{
            res.render('test', {
                questions: questions,
                question: random_question,
                answer1: answer[0].answer_string,
                answer2: answer[1].answer_string,
                answer3: answer[2].answer_string,
                title: 'MR Test',
                current: 'test',
                number_test: req.session.view,
            });
        }).catch();
    }
    else{
        req.session.view = 0;
        res.redirect("/thanks/")
    }
    
});

module.exports = router;