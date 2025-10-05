'use strict';

const { authenticationV2 } = require('../../auth/authUtils');
const rbacController = require('../../controllers/rbac.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');

const express = require('express');
const router = express.Router();

// router.use(authenticationV2)

router.post("/role", asyncHandler(rbacController.newRole))
router.get("/role", asyncHandler(rbacController.listRole))

router.post("/resource", asyncHandler(rbacController.newResource))
router.get("/resource", asyncHandler(rbacController.listResource))

module.exports = router;
