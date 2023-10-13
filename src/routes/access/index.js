'use strict';

const accessController = require('../../controllers/access.controller');
const { asyncHandler } = require('../../auth/checkAuth');

const express = require('express');
const router = express.Router();

// Sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));

module.exports = router;
