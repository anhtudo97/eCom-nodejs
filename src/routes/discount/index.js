'use strict';

const { authenticationV2 } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// get amount
router.post('/amount', asyncHandler(discountController.getAllDiscountAmount));
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

// authentication
router.use(authenticationV2)

//
router.post('/', asyncHandler(discountController.createDiscountCode));
router.get('/', asyncHandler(discountController.getAllDiscountCode));

module.exports = router;
