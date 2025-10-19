'use strict';

const winston = require('winston');
const { format } = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.align(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'application.log', dirname: 'logs' })
    ]
});

module.exports = logger;    