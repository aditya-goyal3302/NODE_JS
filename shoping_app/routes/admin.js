const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

const { check , body } = require('express-validator');

// /admin/add-product => GET
router.get('/add-product',isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAuth, [
                            check('title')
                                .isString()
                                .isLength({min:3})
                                .trim()
                                .withMessage("Title must be alphanumeric and between 3-15 characters!"),
                            body('price')
                                .isFloat()
                                .withMessage("Please enter a valid price!"),
                            check('description')
                                .isLength({min:5,max:400})
                                .trim()
                                .withMessage("Description must be between 5-400 characters!"),
                            // body('imageUrl')
                            //     .isURL()
                            //     .withMessage("Please enter a valid URL!")
                                ]
                        , adminController.postAddProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product',isAuth, [
                            check('title')
                                .isString()
                                .isLength({min:3})
                                .trim()
                                .withMessage("Title must be alphanumeric and between 3-15 characters!"),
                            body('price')
                                .isFloat()
                                .withMessage("Please enter a valid price!"),
                            check('description')
                                .isLength({min:5,max:400})
                                .trim()
                                .withMessage("Description must be between 5-400 characters!")
                                ]
                        , adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
