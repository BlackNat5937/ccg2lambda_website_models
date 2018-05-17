const path = require('path');
const express = require('express');
const router = express.Router();

const options = {
    root: path.join(__dirname, '../public'),
};

/**
 * GET home page
 */
router.get('/', function (req, res, next) {
    res.sendFile('images/' + 'graph1.png', options);
});

router.param('file_path', function (req, res, next, path) {
        req.filepath = {
            path: path,
        };
        next();
    }
);

/**
 * GET file
 */
router.get('/:file_path', function (req, res, next) {
    res.sendFile('images/' + req.filepath.path, options);
});

module.exports = router;