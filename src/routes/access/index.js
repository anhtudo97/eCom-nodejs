'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// Sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/signin', asyncHandler(accessController.login));

// authentication
router.use(authenticationV2)

//
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));

module.exports = router;
