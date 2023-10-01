'use strict';

const express = require('express');
const router = express.Router();

router.use('/v1/api', require('./access'));
// router.get('/', (req, res, next) => {
//   // const strCompress = 'Hello Alex';
//   return res.status(200).json({
//     message: 'Welcome to our website',
//     // metadata: strCompress.repeat(10000)
//   });
// });

module.exports = router;
