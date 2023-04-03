const express = require('express');
const router = express.Router();
const path = require('path');
const rootDir = require('../public/path');

router.use('/users', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'users.html'));
});
module.exports = router;