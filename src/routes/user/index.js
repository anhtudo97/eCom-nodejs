'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const userController = require('../../controllers/user.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
// router.use(authenticationV2)

router.post('/new_user', asyncHandler(userController.newUser))

module.exports = router;
