const winston = require("winston");
const path = require("path");

const options = {
    fileCombined: {
        level: "info",
        filename: path.join(__dirname, "../logs/combined.log"),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    fileError: {
        level: "error",
        filename: path.join(__dirname, "../logs/error.log"),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File(options.fileCombined),
        new winston.transports.File(options.fileError),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            ...options.console
        })
    ],
    exitOnError: false, // Do not exit on handled exceptions
});

module.exports = logger;
