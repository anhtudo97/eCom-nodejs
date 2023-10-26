'use strict';

const { authentication } = require('../../auth/authUtils');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// Sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/signin', asyncHandler(accessController.login));

// authentication
router.use(authentication)

//
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router;
