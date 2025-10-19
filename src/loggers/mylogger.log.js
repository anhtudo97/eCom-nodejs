'use strict';

const { format, createLogger, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf, colorize } = format;

const { v4: uuidv4 } = require('uuid');

class MyLogger {
    constructor() {
        const formatPrint = printf(
            ({ timestamp, level, message, requestId, metadata }) => {
                console.log(message, requestId, metadata)
                return `${timestamp} [${level.toUpperCase()}]: ${message} ${requestId ? `| Request ID: ${requestId}` : ''} ${metadata ? `| Metadata: ${JSON.stringify(metadata)}` : ''}`;
            }
        );

        this.logger = createLogger({
            level: process.env.LOG_LEVEL || 'debug',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                colorize(),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    level: 'info',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // Enable compression for save file 
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    )
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    level: 'error',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // Enable compression for save file 
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    )
                })
            ]
        });
    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuidv4();

        return { context, metadata, requestId };
    }

    log(message, params) {
        const pramas = this.commonParams(params);
        const logObject = Object.assign({
            message
        }, pramas);
        this.logger.info(logObject);
    }

    error(message, params) {
        const pramas = this.commonParams(params);
        const logObject = Object.assign({
            message
        }, pramas);
        this.logger.error(logObject);
    }
}

module.exports = new MyLogger()