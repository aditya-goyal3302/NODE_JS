const express = require('express');

const { check , body } = require('express-validator');

const authController = require('../controllers/auth');

const router = express.Router();

const User = require('../models/user');

const bcrypt = require('bcryptjs');

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
        [check('email')
            .isEmail()
            .withMessage("Please Enter valid Email!")
            .normalizeEmail(),
        body('password',"Password must be alphanumeric and between 6-15 characters!")
            .isAlphanumeric()
            .isLength({min:6,max:15})
            .custom((value , {req}) => {
                let email = req.body.email;
                return User.findOne({email:email})
                  .then(user => {
                    if(!user){
                      return Promise.reject("Email not found!")
                    }
                    return bcrypt.compare(value, user.password)
                      .then(doMatch => {
                        if(!doMatch){
                          return Promise.reject("Invalid Password!")
                        }
                        return true;
                      })
                  })
            })
            .trim()
        ], 
        authController.postLogin
);

router.post('/signup',
        [check('email')
            .isEmail()
            .withMessage("Please Enter valid Email!")
            .custom((value,{req})=>{
                return User.findOne({email:value})
                .then(userDoc=>{
                        if(userDoc){
                        return Promise.reject("user already exists!")
                        }
                        return true;
                    }
                )
            })
            .normalizeEmail(),
          body('password',"Password must be alphanumeric and between 6-15 characters!")
            .isAlphanumeric()
            .isLength({min:6,max:15})
            .trim(),
          body('confirmPassword')
            .trim()
            .custom((value,{req})=>{
                if (value !== req.body.password){
                    throw new Error("Password must macth with confirm password!");
                }
                return true;
            })
        ],
        authController.postSignup

);
router.post('/logout', authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset",authController.postReset);

router.get("/reset/:token",authController.getNewPassword);

router.post("/updatepassword",authController.postNewPassword);

module.exports = router;
