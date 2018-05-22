const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);

const fs = require('fs');

function getDB(dbCon) {
    return new Promise((resolve, reject) => {
        con.query("SELECT sentence_string FROM sentences ORDER BY RAND() LIMIT 1", function (err, result, fields) {
            if (err) reject(err);
            console.log(result);
            //random_sentence = result;
            resolve(result);
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
    let questions;

    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });

    let random_sentence = "";

    getDB(con).then(result => {
        random_sentence = result;
    }).then(()=>{
        res.render('test', {
            questions: questions,
            sentence: random_sentence,
            title: 'MR Test',
            current: 'test',
        });
    }).catch();

    /*con.connect(function (err) {
        if (err) throw err;
    });*/
});

module.exports = router;