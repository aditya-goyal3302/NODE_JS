const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {validationResult } = require('express-validator');

// const sendgridTransport = require('nodemailer-sendgrid-transport')

var transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',  
  secure: false,
  port: 587,
  auth: {
      user: "agdoietest@hotmail.com",
      pass: "Acbd@123"
  }
});
exports.getLogin = (req, res, next) => {
  let mess = req.flash('error')
  if(mess.length > 0)
    mess = mess[0];
  else
    mess = null;
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errormessage: mess,
    oldInput: {email:''},
    validationErrors: []
    });
};

exports.getSignup = (req, res, next) => {
  let mess = req.flash('error')
  if(mess.length > 0)
    mess = mess[0];
  else
    mess = null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errormessage: mess,
    oldInput: {email:'',password:'',confirmPassword:''},
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('auth/login',{
      path:'/Login',
      pageTitle:'Login',
      errormessage: errors.array()[0].msg,
      oldInput: {email:email},
      validationErrors: errors.array()
    })
  }
  else{
    User.findOne({email:email})
      .then(user => {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
      })
      .catch(err => console.log(err));
  }
};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('auth/signup',{
      path:'/signup',
      pageTitle:'Signup',
      errormessage: errors.array()[0].msg,
      oldInput: {
        email:email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationErrors: errors.array()
    })
  }
  bcrypt.hash(password,12)
    .then(hashedPassword=>{
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: {items: []}
      });
      return user.save();
    })
    .then(result=>{
      res.redirect('/login');
      return transporter.sendMail({
        to:email,
        from: "agdoietest@hotmail.com",
        subject:'Signup succeeded',
        html:'<h1>You successfully signed up</h1>'
      })
    })
    .then(result=>{res.redirect('/login')})
    .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    // console.log(err);
    res.redirect('/');
  });
};


exports.getReset = (req,res,next)=>{
  let mess = req.flash('error')
  res.render('auth/reset',{
    path:'/reset',
    pageTitle:'Reset Password',
    errormessage: mess,
  })
}

exports.postReset = (req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      // console.log(err)
      // req.flash('error','Reset password failed(err:1)')
      return res.redirect("/reset")
    }
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email})
      .then(user=>{
        if(!user){
          // req.flash('error','No account with that email found')
          return res.redirect("/reset")
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save()
      })
      .then(result=>{
        res.redirect('/')
        transporter.sendMail({
          to:req.body.email,
          from: "agdoietest@hotmail.com",
          subject:'Signup succeeded',
          html:`
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `
        })
      })
      .catch(err=>{
        console.log(err)
        req.flash('error','Reset password failed(err:2 #usernotfound)')
        return res.redirect("/reset")
      })
  })
}

exports.getNewPassword = (req,res,next)=>{
  const token = req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
    .then(user=>{
      let mess = req.flash('error')
      if(mess.length > 0)
        mess = mess[0];
      else
        mess = null;
      res.render('auth/new-pass',{
        path:'/new-password',
        pageTitle:'New Password',
        errormessage: mess,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err=>{
      console.log(err)
      req.flash('error','Reset password failed(err:3)')
      return res.redirect("/reset")
    })
}
exports.postNewPassword = (req,res,next)=>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()},_id:userId})
    .then(user=>{
      resetUser = user;
      return bcrypt.hash(newPassword,12)
    })
    .then(hashedPassword=>{
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save()
    })
    .then(result=>{
      res.redirect('/login')
      transporter.sendMail({
        to:resetUser.email,
        from: "agdoietest@hotmail.com",
        subject:'Signup succeeded',
        html:`
          <p>You password has been changed successfully</p>
          <p>In case you didnt changed it, contact authorities</p>
          `
      })
    })
    .catch(err=>{
      console.log(err)
      req.flash('error','Reset password failed(err:4)')
      return res.redirect("/reset")
    })
}