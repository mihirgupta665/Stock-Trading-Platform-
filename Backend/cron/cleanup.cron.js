const cron = require("node-cron");
const logger = require("../config/winston");
const SettlementLogModel = require("../model/SettlementLogModel");

/**
 * Clean up automated database logs that are older than 8 days to prevent MongoDB storage bloat
 */
const performDbCleanup = async () => {
    logger.info("Initializing automated database logs cleanup...");
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 8);

        // Delete settlement logs older than 8 days
        const result = await SettlementLogModel.deleteMany({
            createdAt: { $lt: cutoffDate }
        });

        logger.info(`Database cleanup completed. Deleted ${result.deletedCount} settlement log entries created before ${cutoffDate.toISOString()}`);
    } catch (err) {
        logger.error(`Database logs cleanup failed: ${err.message}`);
    }
};

/**
 * Initialize Cleanup Cron Task (Runs daily at midnight: 0 0 * * *)
 */
const initCleanupCron = () => {
    const tz = process.env.TIMEZONE || "Asia/Kolkata";
    logger.info(`Scheduling daily database logs cleanup cron for 12:00 AM midnight (${tz})`);

    cron.schedule("0 0 * * *", async () => {
        logger.info("Running scheduled database cleanup job...");
        await performDbCleanup();
    }, {
        timezone: tz
    });
};

module.exports = {
    performDbCleanup,
    initCleanupCron
};
