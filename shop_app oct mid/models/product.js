const mongoose = require('mongoose');
const { use } = require('../routes/shop');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  imageUrl:{
    type: String,
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

module.exports = mongoose.model('Product', productSchema);




























// // const Sequelize = require('sequelize');

// // const sequelize = require('../util/database');
// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// module.exports = class Product {
//   constructor(title, price, description, imageUrl,id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     if(id)
//       this._id =  new mongodb.ObjectId(id);
//     this.userId = userId;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if(this._id){
//       dbOp = db.collection('products')
//       .updateOne({_id: this._id},{$set: this})
//     }
//     else{
//       dbOp= db.collection('products').insertOne(this)
//     }
//     return dbOp
//     .then(result=>{
//       console.log(result);
//     })
//     .catch(err=>{
//       console.log(err);
//     })
//   }
//   static fetchAll(userId) {
//     const db = getDb();
//     let dbOp
//     if (userId){
//       dbOp = db.collection('products').find({userId: userId})
//     }
//     else{
//       dbOp = db.collection('products').find()
//     }
//       return dbOp.toArray()
//       .then(products=>{
//         console.log(products);
//         return products;
//       })
//       .catch(err=>{
//         console.log(err);
//       })
//   }
//   static findById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({_id: new mongodb.ObjectId(prodId)})
//       .next()
//       .then(product=>{
//         console.log(product);
//         return product;
//       })
//       .catch(err=>{
//         console.log(err);
//       })
//     }
//   static deleteById(prodId){
//     const db = getDb();
//     return db.collection('products')
//     .deleteOne({_id: new mongodb.ObjectId(prodId)})
//     .then(result=>{
//       console.log("Deleted");
//     })
//     .catch(err=>{
//       console.log(err);
//     })
//   }
// }
// // const Product = sequelize.define('product', {
// //   id:{
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: Sequelize.STRING,
// //   price:{
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   imageUrl:{
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   description:{
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // })


// // module.exports = Product;


// // // const fs = require('fs');
// // // const path = require('path');
// // // const Cart = require('./cart');

// // const db = require('../util/database');

// // // const p = path.join(
// // //   path.dirname(process.mainModule.filename),
// // //   'data',
// // //   'products.json'
// // // );

// // module.exports = class Product {
// //   constructor(id, title, imageUrl, description, price) {
// //     this.id = id;
// //     this.title = title;
// //     this.imageUrl = imageUrl;
// //     this.description = description;
// //     this.price = price;
// //   }

// //   save() {
// //     return db.execute('INSERT INTO products (title,price,description,imageUrl) VALUES (?,?,?,?)',
// //     [this.title,this.price,this.description,this.imageUrl]);
// //   }

// //   static deleteById(id){
    
// //   }
// //   static findById(id) {
// //     return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
// //   }

// //   static fetchAll() {
// //     return db.execute('SELECT * FROM products');
// //   }

  
    
// // };
