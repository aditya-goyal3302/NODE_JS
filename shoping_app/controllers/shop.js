const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const pdfdoc = require('pdfkit');
const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => {
  pageno = Number(req.query.page);
  let totalItems;
  if(!pageno){
    pageno = 1;
  }

  Product.find()
    .countDocuments()
    .then(numproducts=>{
      totalItems = numproducts;
      return Product.find()
      .skip((pageno-1)*ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
        totalItems:totalItems,
        currentPage:pageno,
        hasNextPage:ITEMS_PER_PAGE*pageno < totalItems,
        hasPreviousPage:pageno>1,
        nextPage:pageno+1,
        previousPage:pageno-1,
        lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  pageno = Number(req.query.page);
  let totalItems;
  if(!pageno){
    pageno = 1;
  }
  Product.find()
    .countDocuments()
    .then(numproducts=>{
      totalItems = numproducts;
      return Product.find()
      .skip((pageno-1)*ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totalItems:totalItems,
        currentPage:pageno,
        hasNextPage:ITEMS_PER_PAGE*pageno < totalItems,
        hasPreviousPage:pageno>1,
        nextPage:pageno+1,
        previousPage:pageno-1,
        lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE),
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      // console.log(user.cart.items)
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

exports.getInvoice = (req,res,next)=>{
  const orderId = req.params.orderId; 
  Order.findById(orderId)
  .then(order=>{
    if(!order){
      return next(new Error('No order found'))
    }
    if(order.user.userId.toString()!==req.user._id.toString()){
      return next(new Error('Unauthorized'))
    }
    const invoiceName = 'invoice-'+orderId+'.pdf'; 
    const invoicePath = path.join('data','invoices',invoiceName);
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    const pdfDoc = new pdfdoc();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice',{underline:true});
    pdfDoc.text('-----------------------');
    let totalPrice = 0;
    order.products.forEach(prod=>{
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc.fontSize(14).text(prod.product.title+' - '+prod.quantity+' x '+'$'+prod.product.price);
    })
    pdfDoc.text('-----------------------');
    pdfDoc.fontSize(20).text('Total Price: $'+totalPrice);
    pdfDoc.end();
    // console.log(invoiceName)
    // fs.readFile(invoicePath,(err,data)=>{
    //   if(err){
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type','application/pdf');
    //   res.setHeader('Content-Disposition','attachment; filename="'+invoiceName+'"');
    //   res.send(data)
    // })
    // const file = fs.createReadStream(invoicePath);
    // res.setHeader('Content-Disposition','inline; filename="'+invoiceName+'"');
    // file.pipe(res);

  })
  .catch(err=>{
    next(err);
  })
  
};