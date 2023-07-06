const express = require('express');
const path = require('path');
const bodyparser = require("body-parser")
const app = express();
app.set('title','My site')
const rootDir = require("./util/path");
const admin_route = require("./routes/admin") ;
const shop_route = require("./routes/shop") ;
// const expresshbs = require('express-handlebars');

// app.engine('hbs',expresshbs());
app.set('view engine','pug');
app.set('views','views')

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyparser.urlencoded({extended:false}));

app.use('/admin',admin_route.routes);
app.use(shop_route);

app.use((req,res,next)=>{
    res.status(404).render('404',{pageTitle:'404'});
});

app.listen(3000);