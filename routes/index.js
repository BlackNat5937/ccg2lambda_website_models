const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Sentence Meaning Representations testing',
        current: '',
    });
});

router.get('/about', function (req, res, next) {
    res.render('about', {
        title: 'About this website',
        current: 'about',
    });
});

module.exports = router;
