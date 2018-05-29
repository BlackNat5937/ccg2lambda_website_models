const express = require('express');
const router = express.Router();
const path = require('path');

const lang_enUS = {
    code: 'en-US',
    path: '',
};
const lang_jpJP = {
    code: 'jp-JP',
    path: 'jp/',
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

let renderLocalised = function (template, req, res, options) {
    if (req.session.lang === undefined) req.session.lang = lang_enUS;
    let templatePath = path.join(req.session.lang.path, template);

    res.render(templatePath, options);
};

let makeLocalised = function (langPath, template) {
    return path.join(langPath, template);
};

module.exports = router;
module.exports.makeLocalised = makeLocalised;
module.exports.renderLocalised = renderLocalised;
