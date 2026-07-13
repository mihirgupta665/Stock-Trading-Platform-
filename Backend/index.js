require("dotenv").config();

// Fail-Fast: Validate required environment variables during server startup
const requiredEnv = ["MONGO_URL", "JWT_SECRET", "FINNHUB_API_KEY"];
const missingEnv = requiredEnv.filter(
    (key) => !process.env[key] || process.env[key].trim() === "" || process.env[key].includes(`YOUR_${key}`)
);
if (missingEnv.length > 0) {
    console.error(`\n================================================================`);
    console.error(`FATAL STARTUP ERROR: Missing or placeholder environment variables:`);
    console.error(missingEnv.map(key => ` - ${key}`).join("\n"));
    console.error(`Please configure these values in your Backend/.env file.`);
    console.error(`================================================================\n`);
    process.exit(1);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const logger = require("./config/winston");
const errorHandler = require("./middleware/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const stockRoutes = require("./routes/stock.routes");
const portfolioRoutes = require("./routes/portfolio.routes");

// Cron Jobs & Initial Market Synchronizer
const { initPriceUpdateCron, syncMarketPrices } = require("./cron/priceUpdate.cron");
const { initSettlementCron } = require("./cron/settlement.cron");
const { initCleanupCron } = require("./cron/cleanup.cron");

const PORT = process.env.PORT || 3002;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Global Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: process.env.NODE_ENV === "production" ? 100 : 10000, // High limit for local development/testing to prevent lockout
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: "Too many requests from this IP, please try again later." }
});
app.use(limiter);

// Register Routes
app.use(authRoutes);
app.use(stockRoutes);
app.use(portfolioRoutes);

// Centralized Error Middleware (must be registered last)
app.use(errorHandler);

async function startServer() {
    try {
        // 1. Establish Database Connection
        await connectDB(MONGO_URL);

        // 2. Perform initial US Stock market price synchronization on startup
        logger.info("Performing initial market price synchronization...");
        try {
            await syncMarketPrices();
            logger.info("Initial market price synchronization completed successfully.");
        } catch (syncErr) {
            logger.error(`Initial price sync failed on startup: ${syncErr.message}. Starting server anyway.`);
        }

        // 3. Initialize Cron Jobs
        initPriceUpdateCron();
        initSettlementCron();
        initCleanupCron();

        // 4. Start Server
        app.listen(PORT, () => {
            logger.info(`Trading Simulator Server started on port ${PORT}`);
        });

    } catch (err) {
        logger.error(`Fatal application startup error: ${err.message}`, { stack: err.stack });
        process.exit(1);
    }
}

startServer();
// Trigger nodemon reload for routing changes, model hotfixes, limit orders, and funds adjustment endpoints
