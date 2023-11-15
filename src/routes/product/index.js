'use strict';

const { authentication } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// Sign up
router.post('/shop/signup', asyncHandler(productController.signUp));
router.post('/shop/signin', asyncHandler(productController.login));

// authentication
router.use(authentication)

//
router.post('/shop/logout', asyncHandler(productController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(productController.handleRefreshToken));

module.exports = router;
