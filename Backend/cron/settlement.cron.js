const cron = require("node-cron");
const logger = require("../config/winston");
const { settlePositions } = require("../services/settlement.service");

/**
 * Initialize Daily Position-to-Holding Settlement Cron Task
 */
const initSettlementCron = () => {
    const settlementTime = process.env.SETTLEMENT_TIME || "01:31";
    const tz = process.env.TIMEZONE || "Asia/Kolkata";
    
    // Parse HH:MM to cron pattern (Minutes Hour * * *)
    const [hour, minute] = settlementTime.split(":");
    const cronPattern = `${minute} ${hour} * * *`; // Runs daily including weekends

    logger.info(`Scheduling daily position settlement cron for ${settlementTime} (${tz}) with pattern: ${cronPattern}`);

    cron.schedule(cronPattern, async () => {
        logger.info("Executing scheduled daily settlement job...");
        try {
            await settlePositions();
            logger.info("Scheduled daily settlement completed successfully.");
        } catch (err) {
            logger.error(`Scheduled daily settlement job failed: ${err.message}`);
        }
    }, {
        timezone: tz
    });
};

module.exports = {
    initSettlementCron
};
