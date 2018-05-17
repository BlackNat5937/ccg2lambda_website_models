const express = require('express');
const router = express.Router();

/**
 * GET home page
 */
router.get('/', function (req, res, next) {
    res.render('test', {
        title: 'Test Results',
        current: 'results',
    });
});

module.exports = router;