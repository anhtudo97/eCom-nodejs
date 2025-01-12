require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');

/**
 * Instance
 */
const app = express();

/**
 * Middleware
 */

// Morgan
// For developement mode
app.use(morgan('dev'));

// For production
// app.use(morgan('combined'));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// require("./tests/inventory.test")
// const productTest = require("./tests/product.test")
// productTest.purchaseProduct("product:001", 10)

/**
 * Init db
 */
require('./dbs/init.mongodb');
// const redis = require("./dbs/init.redis")
// redis.initRedis()
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

/**
 * Init routes
 */
// app.get('/', (req, res, next) => {
//   // const strCompress = 'Hello Alex';
//   return res.status(200).json({
//     message: 'Welcome to our website',
//     // metadata: strCompress.repeat(10000)
//   });
// });
app.use('', require('./routes'));

/**
 * Handle error
 */

app.use((req, res, next)=> {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res,next) => {
  const statusCode = error.status || 500

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    /*
      stack for detech error on debug phase on development mode
    */
    stack: error.stack,
    message: error.message || 'Internal Server Error'
  }) 
})

module.exports = app;
