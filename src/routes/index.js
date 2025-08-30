'use strict';

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

router.get('/api/status', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api oke'
    })
})

// CHECK API KEY
// router.use(apiKey);
// // CHECK API KEY

// router.use(permission('0000'));

// // ROUTES
// router.use('/v1/api/discount', require('./discount'));
// router.use('/v1/api/cart', require('./cart'));
// router.use('/v1/api/checkout', require('./checkout'));
// router.use('/v1/api/inventory', require('./inventory'));
// router.use('/v1/api/product', require('./product'));
// router.use('/v1/api/upload', require('./upload'));
// router.use('/v1/api/comment', require('./comment'));
// router.use('/v1/api/notification', require('./notification'));
// router.use('/v1/api', require('./access'));
// router.get('/', (req, res, next) => {
//   // const strCompress = 'Hello Alex';
//   return res.status(200).json({
//     message: 'Welcome to our website',
//     // metadata: strCompress.repeat(10000)
//   });
// });

module.exports = router;
