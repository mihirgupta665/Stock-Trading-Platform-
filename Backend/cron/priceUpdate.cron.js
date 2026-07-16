const cron = require("node-cron");
const logger = require("../config/winston");
const StockMasterModel = require("../model/StockMasterModel");
const StockPriceModel = require("../model/StockPriceModel");
const { fetchQuote } = require("../services/marketData.service");
const { processTriggeredPendingOrders, expireOldPendingOrders } = require("../services/trading.service");

// Global variable to store information about the price sync execution status
let lastUpdateStatus = {
    status: "NOT_RUN",
    lastUpdated: null,
    nextScheduled: null
};

const checkMarketOpen = () => {
    const tz = "Asia/Kolkata";
    const now = new Date();
    
    // Format the current hour and minute in Asia/Kolkata timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "numeric",
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === "hour").value, 10);
    const minute = parseInt(parts.find(p => p.type === "minute").value, 10);
    
    const currentMins = hour * 60 + minute;
    
    // Open: 7:00 PM IST (19:00 * 60 = 1140 minutes)
    // Close: 1:30 AM IST (1 * 60 + 30 = 90 minutes) of next day
    const openMins = 19 * 60; // 1140
    const closeMins = 1 * 60 + 30; // 90
    
    // Market is open if current time is >= 7:00 PM (1140) OR current time is < 1:30 AM (90)
    return currentMins >= openMins || currentMins < closeMins;
};

/**
 * Synchronize live US stock prices from Finnhub to MongoDB cache
 */
const syncMarketPrices = async () => {
    logger.info("Initializing market price synchronization...");

    try {
        // 1. Fetch dynamic active US stocks from StockMaster
        const dynamicStocks = await StockMasterModel.find({ isDynamic: true, active: true }).lean();
        
        if (dynamicStocks.length === 0) {
            logger.info("No active dynamic US stocks registered in StockMaster.");
            return;
        }

        logger.info(`Found ${dynamicStocks.length} dynamic stocks to update. Starting quotes fetch...`);

        const bulkOperations = [];

        // 2. Fetch prices in parallel batches of 5 to optimize boot-up and cron latency
        const batchSize = 5;
        for (let i = 0; i < dynamicStocks.length; i += batchSize) {
            const batch = dynamicStocks.slice(i, i + batchSize);
            await Promise.all(
                batch.map(async (stock) => {
                    try {
                        const quoteInfo = await fetchQuote(stock.symbol);
                        bulkOperations.push({
                            updateOne: {
                                filter: { symbol: stock.symbol },
                                update: {
                                    $set: {
                                        currentPrice: quoteInfo.currentPrice,
                                        open: quoteInfo.open,
                                        high: quoteInfo.high,
                                        low: quoteInfo.low,
                                        previousClose: quoteInfo.previousClose,
                                        change: quoteInfo.change,
                                        changePercent: quoteInfo.changePercent,
                                        volume: quoteInfo.volume,
                                        lastUpdated: new Date()
                                    }
                                },
                                upsert: true
                            }
                        });
                    } catch (err) {
                        logger.error(`Failed to fetch quote for ${stock.symbol} after all retries: ${err.message}. Skipping...`);
                    }
                })
            );
        }

        // 3. Perform bulkWrite update to cache the prices at once
        if (bulkOperations.length > 0) {
            logger.info(`Submitting bulkWrite update for ${bulkOperations.length} stock prices...`);
            await StockPriceModel.bulkWrite(bulkOperations);
            logger.info("StockPrice collection bulkWrite update completed successfully.");
            
            // Check pending orders for all updated symbols
            for (const op of bulkOperations) {
                const symbol = op.updateOne.filter.symbol;
                const newPrice = op.updateOne.update.$set.currentPrice;
                await processTriggeredPendingOrders(symbol, newPrice);
            }
            
            lastUpdateStatus = {
                status: "SUCCESS",
                lastUpdated: new Date(),
                nextScheduled: new Date(Date.now() + 2 * 60 * 1000)
            };
        } else {
            logger.warn("No stock prices fetched successfully; bulkWrite skipped.");
            lastUpdateStatus.status = "NO_UPDATES";
        }

    } catch (err) {
        logger.error(`Stock price synchronization cron failed: ${err.message}`);
        lastUpdateStatus.status = "FAILED";
    }
};

/**
 * Initialize Cron Job
 */
const initPriceUpdateCron = () => {
    const interval = process.env.PRICE_REFRESH_INTERVAL || "*/2 * * * *";
    
    logger.info(`Scheduling stock price update cron with interval: ${interval}`);

    cron.schedule(interval, async () => {
        // Run continuous cleanup of pending orders older than 24 hours
        try {
            await expireOldPendingOrders();
        } catch (expireErr) {
            logger.error(`Error during pending orders cleanup: ${expireErr.message}`);
        }

        const isCurrentlyOpen = checkMarketOpen();
        
        if (!isCurrentlyOpen) {
            logger.info("Market is currently closed. Skipping price sync cron execution.");
            lastUpdateStatus.status = "MARKET_CLOSED";
            return;
        }

        await syncMarketPrices();
    });
};

const getPriceSyncStatus = () => {
    return {
        ...lastUpdateStatus,
        isMarketOpen: checkMarketOpen()
    };
};

module.exports = {
    syncMarketPrices,
    initPriceUpdateCron,
    getPriceSyncStatus
};
