const express = require('express');
const path = require('path');
const bodyparser = require("body-parser")
const app = express();
const rootDir = require("./util/path");
const admin_route = require("./routes/admin") ;
const shop_route = require("./routes/shop") ;

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyparser.urlencoded({extended:false}));

app.use('/admin',admin_route);
app.use(shop_route);

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(rootDir,'views','404.html'));
});

app.listen(3000);