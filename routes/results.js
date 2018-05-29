const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);

function getPercentage(a,b){
    return (a / b) * 100;
}

function getGlobalSuccess(dbCon){
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS successCount FROM `results` WHERE results_isright = 'yes'", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getTotalAnswers(dbCon){
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS total FROM `results`", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getDrsSuccess(dbCon){

}

function getGraphSuccess(dbCon){

}

/**
 * GET home page
 */
router.get('/', function (req, res, next) {
    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });
    let globalSuccess;
    let totalAnswers;

    getGlobalSuccess(con).then(globalSuccessResult => {
        globalSuccess = globalSuccessResult[0].successCount;
    }).then(()=>{
        return getTotalAnswers(con).then(totalAnswersResult =>{
            totalAnswers = totalAnswersResult[0].total;
        });
    }).then(() => {
        res.render('results', {
            title: 'Test Results',
            current: 'results',
            globalSuccessCount: globalSuccess,
            totalAnswersCount: totalAnswers,
            globalPercentage: getPercentage(globalSuccess, totalAnswers),
        });
    })

    
});

module.exports = router;