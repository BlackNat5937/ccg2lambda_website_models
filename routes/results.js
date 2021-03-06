const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);
const lang = require('./lang');

function toFixed(num, fixed) {
    console.log(num);
    if (num === undefined || num === null || num == "NaN")
        return 0;
    else {
        let re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }
}

function getPercentage(a, b) {
    return toFixed((a / b) * 100, 1);
}

function getGlobalSuccess(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS successCount FROM `results` WHERE results_isright = 'yes'", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getTotalAnswers(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS total FROM `results`", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getDrsSuccess(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS successCount FROM `results` WHERE results_isright = 'yes' AND results_visualizationtype = 'drs'", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getDrsTotal(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS total FROM `results` WHERE results_visualizationtype = 'drs'", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getGraphSuccess(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS successCount FROM `results` WHERE results_isright = 'yes' AND results_visualizationtype = 'graph'", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getGraphTotal(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS total FROM `results` WHERE results_visualizationtype = 'graph'", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getAllSentences(dbCon) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM sentences", (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getSentence(dbCon, code) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM sentences WHERE sentences.sentence_code = " + code, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getDrsSentenceSuccess(dbCon, code) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS successCount FROM results INNER JOIN questions ON results_questioncode = questions.question_code INNER JOIN sentences ON questions.question_sentencecode = sentences.sentence_code WHERE results_isright = 'yes' AND results_visualizationtype = 'drs' AND sentences.sentence_code = " + code, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getDrsSentenceTotal(dbCon, code) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS total FROM results INNER JOIN questions ON results_questioncode = questions.question_code INNER JOIN sentences ON questions.question_sentencecode = sentences.sentence_code WHERE results_visualizationtype = 'drs' AND sentences.sentence_code = " + code, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getGraphSentenceSuccess(dbCon, code) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS successCount FROM results INNER JOIN questions ON results_questioncode = questions.question_code INNER JOIN sentences ON questions.question_sentencecode = sentences.sentence_code WHERE results_isright = 'yes' AND results_visualizationtype = 'graph' AND sentences.sentence_code = " + code, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

function getGraphSentenceTotal(dbCon, code) {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT COUNT(*) AS total FROM results INNER JOIN questions ON results_questioncode = questions.question_code INNER JOIN sentences ON questions.question_sentencecode = sentences.sentence_code WHERE results_visualizationtype = 'graph' AND sentences.sentence_code = " + code, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

router.param('code_sentence', (req, res, next, code) => {
        req.code_sentence = code;
        next();
    }
);

router.get('/sentence/:code_sentence', function (req, res, next) {
    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });

    let sentence_string;

    let sentenceDrsSuccess;
    let sentenceDrsTotal;
    let sentenceGraphSuccess;
    let sentenceGraphTotal;

    getSentence(con, req.code_sentence).then(getSentenceResult => {
        sentence_string = getSentenceResult[0].sentence_string;
    }).then(() => {
        return getDrsSentenceSuccess(con, req.code_sentence).then(drsSentenceSuccessResult => {
            sentenceDrsSuccess = drsSentenceSuccessResult[0].successCount;
        });
    }).then(() => {
        return getDrsSentenceTotal(con, req.code_sentence).then(drsSentenceTotalResult => {
            sentenceDrsTotal = drsSentenceTotalResult[0].total;
        });
    }).then(() => {
        return getGraphSentenceSuccess(con, req.code_sentence).then(graphSentenceSuccessResult => {
            sentenceGraphSuccess = graphSentenceSuccessResult[0].successCount;
        });
    }).then(() => {
        return getGraphSentenceTotal(con, req.code_sentence).then(graphSentenceTotalResult => {
            sentenceGraphTotal = graphSentenceTotalResult[0].total;
        });
    }).then(() => {
        res.render('question_result', {
            title: 'Question results',
            current: 'results',
            sentence: sentence_string,
            drsSuccess: sentenceDrsSuccess,
            drsTotal: sentenceDrsTotal,
            drsPercentage: getPercentage(sentenceDrsSuccess, sentenceDrsTotal),
            graphSuccess: sentenceGraphSuccess,
            graphTotal: sentenceGraphTotal,
            graphPercentage: getPercentage(sentenceGraphSuccess, sentenceGraphTotal),
        });
    })


});

/**
 * GET home page
 */
router.get('/', (req, res) => {
    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });
    let globalSuccess;
    let totalAnswers;
    let drsSuccess;
    let totalDrs;
    let graphSuccess;
    let totalGraph;

    let allSentences;

    getGlobalSuccess(con).then(globalSuccessResult => {
        globalSuccess = globalSuccessResult[0].successCount;
    }).then(() => {
        return getTotalAnswers(con).then(totalAnswersResult => {
            totalAnswers = totalAnswersResult[0].total;
        });
    }).then(() => {
        return getDrsSuccess(con).then(drsSuccessResult => {
            drsSuccess = drsSuccessResult[0].successCount;
        });
    }).then(() => {
        return getDrsTotal(con).then(drsTotalResult => {
            totalDrs = drsTotalResult[0].total;
        });
    }).then(() => {
        return getGraphSuccess(con).then(graphSuccessResult => {
            graphSuccess = graphSuccessResult[0].successCount;
        });
    }).then(() => {
        return getGraphTotal(con).then(graphTotalResult => {
            totalGraph = graphTotalResult[0].total;
        });
    }).then(() => {
        return getAllSentences(con).then(allSentencesResult => {
            allSentences = allSentencesResult;
        });
    }).then(() => {
        lang.renderLocalised('results', req, res, {
            title: 'Test Results',
            current: 'results',
            globalSuccess: globalSuccess,
            globalTotal: totalAnswers,
            globalPercentage: getPercentage(globalSuccess, totalAnswers),
            drsSuccess: drsSuccess,
            drsTotal: totalDrs,
            drsPercentage: getPercentage(drsSuccess, totalDrs),
            graphSuccess: graphSuccess,
            graphTotal: totalGraph,
            graphPercentage: getPercentage(graphSuccess, totalGraph),
            sentences: allSentences,
        });
    }).catch(console.err);
});

module.exports = router;