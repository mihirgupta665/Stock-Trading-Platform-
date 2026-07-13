const https = require("https");
const logger = require("../config/winston");
const StockPriceModel = require("../model/StockPriceModel");
const StockMasterModel = require("../model/StockMasterModel");

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`HTTP Status ${res.statusCode}: ${data}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on("error", (err) => {
            reject(err);
        });
    });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 5, baseDelay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await getRequest(url);
        } catch (err) {
            const isLast = i === retries - 1;
            logger.warn(`Finnhub call failed. Attempt ${i + 1}/${retries}. URL: ${url}. Error: ${err.message}`);
            if (isLast) throw err;
            // Exponential Backoff: 1s, 2s, 4s, 8s, 16s
            await wait(baseDelay * Math.pow(2, i));
        }
    }
};

/**
 * Fetch Quote from Finnhub for a US Stock
 */
const fetchQuote = async (symbol) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    const maxRetries = parseInt(process.env.MAX_API_RETRIES || "5", 10);
    const baseDelay = parseInt(process.env.API_RETRY_BASE_DELAY || "1000", 10);

    if (!apiKey || apiKey === "YOUR_FINNHUB_KEY") {
        logger.error("Finnhub API Key is missing or default placeholder.");
        throw new Error("Finnhub API Key configuration missing.");
    }

    const url = `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${apiKey}`;
    logger.info(`Fetching quote for ${symbol} from Finnhub`);
    
    const quote = await fetchWithRetry(url, maxRetries, baseDelay);
    return {
        symbol,
        currentPrice: quote.c,
        open: quote.o,
        high: quote.h,
        low: quote.l,
        previousClose: quote.pc,
        change: quote.d,
        changePercent: quote.dp,
        volume: quote.v || 0,
        lastUpdated: new Date(),
    };
};

/**
 * Fetch Company Profile from Finnhub
 */
const fetchCompanyProfile = async (symbol) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey || apiKey === "YOUR_FINNHUB_KEY") {
        throw new Error("Finnhub API Key configuration missing.");
    }

    const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    logger.info(`Fetching company profile for ${symbol} from Finnhub`);
    
    const profile = await fetchWithRetry(url, 3, 1000);
    return {
        companyName: profile.name,
        country: profile.country,
        currency: profile.currency,
        exchange: profile.exchange,
        logo: profile.logo,
        industry: profile.finnhubIndustry,
        marketCapitalization: profile.marketCapitalization,
        weburl: profile.weburl,
        ipo: profile.ipo,
    };
};

/**
 * Fetch Historical Candle Data for Charts (1D, 1W, 1M, 3M, 6M, 1Y, 5Y)
 */
const fetchHistoricalData = async (symbol, range = "1M") => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey || apiKey === "YOUR_FINNHUB_KEY") {
        throw new Error("Finnhub API Key configuration missing.");
    }

    const to = Math.floor(Date.now() / 1000);
    let from;
    let resolution = "D";

    const ONE_DAY = 24 * 60 * 60;
    
    switch (range.toUpperCase()) {
        case "1D":
            from = to - ONE_DAY;
            resolution = "5"; // 5-minute candles
            break;
        case "1W":
            from = to - 7 * ONE_DAY;
            resolution = "60"; // Hourly candles
            break;
        case "1M":
            from = to - 30 * ONE_DAY;
            resolution = "D"; // Daily candles
            break;
        case "3M":
            from = to - 90 * ONE_DAY;
            resolution = "D";
            break;
        case "6M":
            from = to - 180 * ONE_DAY;
            resolution = "D";
            break;
        case "1Y":
            from = to - 365 * ONE_DAY;
            resolution = "D";
            break;
        case "5Y":
            from = to - 5 * 365 * ONE_DAY;
            resolution = "W"; // Weekly candles
            break;
        default:
            from = to - 30 * ONE_DAY;
            resolution = "D";
    }

    const url = `${FINNHUB_BASE_URL}/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`;
    logger.info(`Fetching candles for ${symbol} with range ${range} and resolution ${resolution}`);
    
    const data = await fetchWithRetry(url, 3, 1000);
    
    if (data.s !== "ok") {
        throw new Error(`Finnhub returned status: ${data.s}`);
    }

    return {
        prices: data.c,      // Close prices
        timestamps: data.t,  // Timestamps
        highs: data.h,
        lows: data.l,
        opens: data.o,
    };
};

/**
 * Fetch general market news
 */
const fetchMarketNews = async () => {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey || apiKey === "YOUR_FINNHUB_KEY") {
        throw new Error("Finnhub API Key configuration missing.");
    }

    const url = `${FINNHUB_BASE_URL}/news?category=general&token=${apiKey}`;
    logger.info("Fetching market news from Finnhub");
    
    const news = await fetchWithRetry(url, 3, 1000);
    return news.slice(0, 10).map((item) => ({
        id: item.id,
        datetime: item.datetime,
        headline: item.headline,
        image: item.image,
        summary: item.summary,
        url: item.url,
        source: item.source,
    }));
};

module.exports = {
    fetchQuote,
    fetchCompanyProfile,
    fetchHistoricalData,
    fetchMarketNews,
};
