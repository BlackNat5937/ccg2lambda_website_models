const path = require('path');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require(`../config.json`);

const options = {
    root: path.join(__dirname, '../public'),
};

function getGraphImageFromDatabase(dbCon, codeSentence) {
    return new Promise((resolve, reject) => {
        dbCon.query(`SELECT * FROM graphimages WHERE graphimages.graphimage_sentencecode = ${codeSentence}`
            , (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
    })
}

function getDRSImageFromDatabase(dbCon, codeSentence) {
    return new Promise((resolve, reject) => {
        dbCon.query(`SELECT * FROM boximages WHERE boximages.boximage_sentencecode = ${codeSentence}`
            , (err, result) => {
                if (err) return reject(err);
                resolve(result);
            })
    })
}

/**
 * PARAM for file_path
 */
router.param('file_path', (req, res, next, path) => {
    req.file_path = {
            path: path,
        };
        next();
    }
);

/**
 * GET file
 */
router.get('/:file_path', (req, res) => {
    res.sendFile('images/' + req.file_path.path, options);
});

/**
 * PARAM for sentence_id
 */
router.param('sentence_id', (req, res, next, id) => {
    req.sentence_id = id;
    next();
});

/**
 * GET graph image
 */
router.get('/graph/:sentence_id', (req, res) => {
    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });
    let image;
    getGraphImageFromDatabase(con, req.sentence_id).then(imageResult => {
        image = imageResult[0].graphimage_image;
    }).then(() => {
        res.contentType('png');
        res.send(Buffer.from(image));
    }).catch(console.error);
});

/**
 * GET graph image
 */
router.get('/drs/:sentence_id', (req, res) => {
    let con = mysql.createConnection({
        host: config.mysql_host,
        user: config.mysql_username,
        password: config.mysql_password,
        database: "visualization"
    });
    let image;
    getDRSImageFromDatabase(con, req.sentence_id).then(imageResult => {
        image = imageResult[0].boximage_image;
    }).then(() => {
        res.contentType('png');
        res.send(Buffer.from(image));
    }).catch(console.error);
});

module.exports = router;