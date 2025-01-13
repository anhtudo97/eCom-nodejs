'use strict';

const { authenticationV2 } = require('../../auth/authUtils');
const cartController = require('../../controllers/cart.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

router.post("", asyncHandler(cartController.addToCart))
router.delete("", asyncHandler(cartController.delete))
router.post("/update", asyncHandler(cartController.update))
router.get("", asyncHandler(cartController.listToCart))

module.exports = router;
