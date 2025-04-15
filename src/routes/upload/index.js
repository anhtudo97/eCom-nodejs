'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../configs/multer.config');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(uploadController.updaloadFile))
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.updaloadFileThumb))

module.exports = router;
