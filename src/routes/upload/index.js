'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk, uploadMemory } = require('../../configs/multer.config');
const uploadController = require('../../controllers/upload.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(uploadController.updaloadFile))
router.post('/thumb', uploadDisk.single('file'), asyncHandler(uploadController.updaloadFileThumb))
router.post('/thumbs', uploadDisk.array('files', 3), asyncHandler(uploadController.updaloadFilesThumb))
router.post('/s3', uploadMemory.single('file'), asyncHandler(uploadController.updaloadFileLocalS3))

module.exports = router;
