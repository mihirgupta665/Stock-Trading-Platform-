const logger = require("../config/winston");

const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

module.exports = errorHandler;
