'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const emailController = require('../../controllers/email.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
// router.use(authenticationV2)

router.post('/new_template', asyncHandler(emailController.newTemplate))

module.exports = router;
