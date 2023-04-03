const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../public/path');

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname,'..', 'views', 'home.html'));
});

module.exports = router;