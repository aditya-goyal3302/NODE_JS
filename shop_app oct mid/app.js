const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const app = express();
const mongoose = require('mongoose');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = "mongodb+srv://agdoie-app:0ISZL1RJpYp6FDUM@cluster0.7hawrym.mongodb.net/shop"

app.set('view engine', 'ejs');
app.set('views', 'views');
const adminRoutes = require('./routes/admin');
const store = new MongoDBStore({
    uri:MONGODB_URI,
    collection : 'sessions'
})
app.use(
    session({
        secret:'my secret',
        resave : false, 
        saveUninitialized : false, 
        store : store
    })
);

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
})
app.use(shopRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);

//mongodb

app.use(errorController.get404);


mongoose.connect(MONGODB_URI)
.then(result =>{
    User.findOne().then(user=>{
        if(!user){
            const user =  new User({
                name : 'Agdoie',
                email : 'agdoie@test.com',
                cart : {
                    items : []
                }
            })
            user.save()
        }
    })
    
    app.listen(3000);
})
.catch(err => {
    console.log(err);
}); 

// const pdf= require('pdf-parse');
// const fs = require('fs');
// const pdfjs = require('pdfjs-dist');
//sequelize & pdf parser
// const Seqeulize = require('./util/database');
// const order = require('./models/order');
// const orderItem = require('./models/order-item');
// const sequelize = require('./util/database');
// const Order = require('./models/order');

// app.use("/pdf",(req,res,next)=>{
//     const p = path.join(
//         path.dirname(process.mainModule.filename),
//         'public',
//         'Chitkara_University_sample.pdf'
//       );
//     const text = extractTextFromPDF(p,text=>{
//         res.send(text);
//         console.log(parseTableData(text));
//         // parseTableData(text);
//     });
// });
// async function extractTextFromPDF(pdfPath,cb) {
//     const data = new Uint8Array(fs.readFileSync(pdfPath));
//     // console.log(data);
//     const doc = await pdfjs.getDocument(data).promise;
//     // console.log(doc);
//     let text = '';

//     for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
//         const page = await doc.getPage(pageNum);
//         // console.log(page);
//         const content = await page.getTextContent();
//         console.log(content);
//         text += content.items.map(item => item.str).join('');
//     }
//     var final = text.replace('Chitkara UniversityCourse title : CA001Sr_no. Roll_no. Name Email Ph_no.','');
//     cb(final);
// }
// sequelize
// Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(User);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: orderItem });
// Product.belongsToMany(Order, { through: orderItem });


// sequelize
//     //.sync({ force: true })
//     .sync()
//     .then(result => {
//         return User.findByPk(1);
//         // console.log(result);
//     })
//     .then(user => {
//         if (!user) {
//             return User.create({ name: 'Max', email: 'test@test.com' });
//         }
//         return user;
//     }).then(user => {
//         //console.log(user);
//         return user.createCart();
//     }).then(cart=>{
//         app.listen(3000);
//     })
//     .catch(err => {
//         console.log(err);
//     });

