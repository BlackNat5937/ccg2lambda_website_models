const express = require('express');
const router = express.Router();
const lang = require('./lang');

router.get('/', function (req, res, next) {
    lang.renderLocalised('thanks', req, res, {
        title: 'Thank you',
        current: 'test',
    });
});

module.exports = router;