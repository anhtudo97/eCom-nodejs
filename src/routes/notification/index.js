'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
router.use(authenticationV2)
router.get('', asyncHandler(notificationController.getNotificationByUser))


module.exports = router;
