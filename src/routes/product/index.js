'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const productController = require('../../controllers/product.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
router.use(authenticationV2)

//
router.post('', asyncHandler(productController.createProduct));
router.post('/publish/:id', asyncHandler(productController.publishProductByShop));

// QUERY
router.get('/drafts', asyncHandler(productController.getAllDraftsForShop))
router.get('/published', asyncHandler(productController.getAllPublishedForShop))

module.exports = router;
