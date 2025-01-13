'use strict';

const { authentication, authenticationV2 } = require('../../auth/authUtils');
const commentController = require('../../controllers/comment.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(commentController.createComment))
router.delete('', asyncHandler(commentController.deleteCommentById))
router.get('', asyncHandler(commentController.getCommentsByParentId))


module.exports = router;
