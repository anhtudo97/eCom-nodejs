'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

// CHECK API KEY

router.use(apiKey);
// CHECK API KEY

router.use(permission('0000'));

// ROUTES
router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));
// router.get('/', (req, res, next) => {
//   // const strCompress = 'Hello Alex';
//   return res.status(200).json({
//     message: 'Welcome to our website',
//     // metadata: strCompress.repeat(10000)
//   });
// });

module.exports = router;
