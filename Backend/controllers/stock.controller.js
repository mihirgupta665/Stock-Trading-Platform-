const WatchlistModel = require("../model/WatchlistModel");
const StockMasterModel = require("../model/StockMasterModel");
const { getPriceSyncStatus } = require("../cron/priceUpdate.cron");
const {
    fetchCompanyProfile,
    fetchHistoricalData,
    fetchMarketNews,
} = require("../services/marketData.service");
const logger = require("../config/winston");

/**
 * Get current status of the stock market and latest price update times
 */
const getMarketStatus = async (req, res, next) => {
    try {
        const syncStatus = getPriceSyncStatus();
        return res.json(syncStatus);
    } catch (err) {
        next(err);
    }
};

/**
 * Get company profile details for a stock symbol
 */
const getCompanyDetails = async (req, res, next) => {
    const { symbol } = req.params;
    try {
        // 1. Look up in StockMaster first
        const master = await StockMasterModel.findOne({ symbol: symbol.toUpperCase() }).lean();
        if (master && master.isDynamic) {
            // Fetch live details from Finnhub API
            try {
                const profile = await fetchCompanyProfile(symbol.toUpperCase());
                return res.json(profile);
            } catch (apiErr) {
                logger.error(`Failed to fetch company profile from API for ${symbol}: ${apiErr.message}`);
                // Fallback to master record if API fails
                return res.json(master);
            }
        } else if (master) {
            // Return Indian static details
            return res.json(master);
        } else {
            return res.status(404).json({ error: `Stock symbol ${symbol} not found.` });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * Get historical price data for charts
 */
const getStockHistory = async (req, res, next) => {
    const { symbol } = req.params;
    const { range } = req.query; // e.g. 1D, 1W, 1M, 1Y

    try {
        const master = await StockMasterModel.findOne({ symbol: symbol.toUpperCase() }).lean();
        
        // If it's a dynamic US stock, get from Finnhub
        if (master && master.isDynamic) {
            try {
                const history = await fetchHistoricalData(symbol.toUpperCase(), range || "1M");
                return res.json(history);
            } catch (apiErr) {
                logger.error(`API Candle fetch failed for ${symbol}: ${apiErr.message}`);
                return res.status(500).json({ error: "Failed to load stock history from market data provider." });
            }
        }

        // If it's a static Indian stock, return simulated historical prices
        const priceDoc = await require("../model/StockPriceModel").findOne({ symbol: symbol.toUpperCase() }).lean();
        const basePrice = priceDoc ? priceDoc.currentPrice : 500;
        
        const count = range === "1D" ? 24 : range === "1W" ? 7 : 30;
        const prices = [];
        const timestamps = [];
        const now = Math.floor(Date.now() / 1000);

        for (let i = count; i >= 0; i--) {
            const timeOffset = range === "1D" ? i * 3600 : range === "1W" ? i * 86400 : i * 86400;
            timestamps.push(now - timeOffset);
            
            // Random walk simulation around base price
            const dev = (Math.random() - 0.5) * 0.05 * basePrice;
            prices.push(Number((basePrice + dev).toFixed(2)));
        }

        return res.json({
            prices,
            timestamps,
            opens: prices,
            highs: prices.map(p => p * 1.01),
            lows: prices.map(p => p * 0.99),
        });

    } catch (err) {
        next(err);
    }
};

/**
 * Fetch top general news from market provider
 */
const getNews = async (req, res, next) => {
    try {
        const news = await fetchMarketNews();
        return res.json(news);
    } catch (err) {
        next(err);
    }
};

/**
 * Watchlist CRUD operations
 */
const getWatchlist = async (req, res, next) => {
    try {
        const list = await WatchlistModel.find({ user: req.user.id }).sort("-createdAt").lean();
        return res.json(list);
    } catch (err) {
        next(err);
    }
};

const addToWatchlist = async (req, res, next) => {
    const { symbol, companyName } = req.body;
    if (!symbol || !companyName) {
        return res.status(400).json({ error: "Symbol and companyName are required" });
    }

    try {
        const watchlistItem = new WatchlistModel({
            user: req.user.id,
            symbol: symbol.toUpperCase(),
            companyName
        });
        await watchlistItem.save();
        return res.status(201).json(watchlistItem);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ error: "Stock is already in your watchlist" });
        }
        next(err);
    }
};

const removeFromWatchlist = async (req, res, next) => {
    const { symbol } = req.params;
    try {
        const result = await WatchlistModel.deleteOne({
            user: req.user.id,
            symbol: symbol.toUpperCase()
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Stock not found in your watchlist" });
        }
        return res.json({ message: "Stock removed from watchlist successfully" });
    } catch (err) {
        next(err);
    }
};

const getPriceList = async (req, res, next) => {
    try {
        const prices = await require("../model/StockPriceModel").find({}).sort({ symbol: 1 }).lean();
        return res.json(prices);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getMarketStatus,
    getCompanyDetails,
    getStockHistory,
    getNews,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getPriceList
};
