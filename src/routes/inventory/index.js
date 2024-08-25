'use strict';

const { authenticationV2 } = require('../../auth/authUtils');
const inventoryController = require('../../controllers/inventory.controller');
const { asyncHandler } = require('../../helpers/asyncHandler');


const express = require('express');
const router = express.Router();

router.use(authenticationV2)
router.post("/", asyncHandler(inventoryController.addStockToInventory))

module.exports = router;
