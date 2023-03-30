const express = require("express");

const app = express();
app.use('/',(req,res,next)=>{
    res.send('<h1>hello from experss</h1>');
    next();
})
app.use('/home',(req,res,next)=>{
    console.log("in middle ware:");
    res.send('<h1>home from experss</h1>');
})

app.use('/',(req,res,next)=>{
    console.log("in another middleware:");
    res.send('<h1>hello from experss</h1>');
})


app. listen(3000);