const express = require('express');
const router = express.Router();
const lang = require('./lang');

/**
 * GET home page
 */
router.get('/', (req, res) => {
    lang.renderLocalised('index', req, res, {
        title: 'Sentence Meaning Representations testing',
        current: '',
    });
});

/**
 * GET about page
 */
router.get('/about', (req, res) => {
    lang.renderLocalised('about', req, res, {
        title: 'About this website',
        current: 'about',
    });
});

module.exports = router;
