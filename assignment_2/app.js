const experss = require('express');
const bodyparser = require("body-parser")
const app = experss();

// app.use((req,res,next)=>{
//     console.log("test reached")
//     next(); 
// })

// app.use((req,res,next)=>{
//     console.log("test1 reached");
// })

app.use(bodyparser.urlencoded({extended:false}));

app.use('/add',(req,res,next)=>{
    res.send('<form action = "/product" method="POST"> Name: <input type="text" name="title"><br><button type="submit"> send </button></form>');
})
app.post('/product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/')

})
app.use('/',(req,res,next)=>{
    res.send("<h2> You are on home page");
})
    
app.listen(3000);