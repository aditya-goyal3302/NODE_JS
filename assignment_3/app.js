const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./public/path');
const adminRoutes = require('./routes/home');
const userRoutes = require('./routes/users');
const app = express();


app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(rootDir, 'public')));

app.use(userRoutes);
app.use(adminRoutes);

app.use((req, res, next) => { 
    res.status(404).send('<h1>Page not found</h1>');
});
app.listen(3000);