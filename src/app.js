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

/**
 * Init db
 */
require('./dbs/init.mongodb');
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
    message: error.message || 'Internal Server Error'
  }) 
})

module.exports = app;
