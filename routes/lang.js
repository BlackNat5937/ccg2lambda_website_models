const express = require('express');
const router = express.Router();

const lang_enUS = {
    code: 'en-US',
    path: '/',
};
const lang_jpJP = {
    code: 'jp-JP',
    path: '/jp/',
};

/**
 * GET en-US locale
 */
router.get('/en-US', (req, res) => {
    req.session.lang = lang_enUS;
    res.redirect('/');
});

/**
 * GET jp-JP
 */
router.get('/jp-JP', (req, res) => {
    req.session.lang = lang_jpJP;
    res.redirect('/');
});

module.exports = router;
