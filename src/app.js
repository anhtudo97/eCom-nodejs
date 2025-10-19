require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid')
const myLogger = require('./loggers/mylogger.log');

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

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;
  myLogger.log(`input parameters -- ${req.method}`, [
    req.path,
    {
      requestId: req.requestId,
    },
    req.method === 'POST' ? req.body : req.query,
  ])
  next();
})

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
app.get('/', (req, res, next) => {
  // const strCompress = 'Hello Alex';
  return res.status(200).json({
    message: 'Welcome to our website',
    // metadata: strCompress.repeat(10000)
  });
});
app.use('', require('./routes'));

/**
 * Handle error
 */

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  const message = `${statusCode} - ${Date.now() - error.now} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  myLogger.error(message, [
    req.path,
    {
      requestId: req.requestId,
    },
    {
      message: error.message,
    }
  ])
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
