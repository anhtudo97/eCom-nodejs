'use strict';

const { authenticationV2 } = require('../../auth/authUtils');
const checkoutController = require('../../controllers/checkout.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview))

module.exports = router;
