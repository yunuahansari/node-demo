'use strict';

import winston from 'winston';
import winstonDailyRotateFile from "winston-daily-rotate-file";
import path from 'path';

 var transportApiInfo = new (winston.transports.DailyRotateFile)({
   filename: path.join(__dirname, "../", "logs", "api-info-%DATE%.log"),
   datePattern: "YYYY-MM-DD",
   level: "info",
   //zippedArchive: true,
   //maxSize: "20m",
     maxFiles: "30d",
     json: true 
 });

let infoLogger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            name: 'info-file',
            filename: path.join(__dirname, '../', 'logs', 'filelog-info.log'),
            level: 'info'
        })
    ]
});

let errorLogger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            name: 'error-file',
            filename: path.join(__dirname, '../', 'logs', 'filelog-error.log'),
            level: 'error'
        })
    ]
});

let apiInfoLogger = new (winston.Logger)({
  transports: [transportApiInfo]
});

export default { infoLogger, errorLogger, apiInfoLogger };