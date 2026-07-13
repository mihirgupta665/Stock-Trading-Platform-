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
    const tz = process.env.TIMEZONE || "Asia/Kolkata";
    
    // Check if it is weekday
    const dayStr = new Date().toLocaleDateString("en-US", { timeZone: tz, weekday: "short" });
    const isWeekend = ["Sat", "Sun"].includes(dayStr);
    if (isWeekend) return false;

    // Check HH:MM
    const timeStr = new Date().toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    const openTime = process.env.MARKET_OPEN || "09:15";
    const closeTime = process.env.MARKET_CLOSE || "15:30";

    return timeStr >= openTime && timeStr <= closeTime;
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

        // 2. Fetch price for each stock and prepare bulk write operations
        for (const stock of dynamicStocks) {
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
                // If a single stock quote fetch fails, we log it and skip to proceed with other stocks
                logger.error(`Failed to fetch quote for ${stock.symbol} after all retries: ${err.message}. Skipping...`);
            }
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
