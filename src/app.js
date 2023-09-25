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

/**
 * Init db
 */

require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
checkOverload()
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

/**
 * Handle error
 */

module.exports = app;
