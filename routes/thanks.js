const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('thanks', {
        title: 'Thank you',
        current: 'test',
    });
});

module.exports = router;