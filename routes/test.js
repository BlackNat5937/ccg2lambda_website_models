const express = require('express');
const router = express.Router();

const fs = require('fs');

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

    res.render('test', {
        questions: questions,
    });
});

module.exports = router;