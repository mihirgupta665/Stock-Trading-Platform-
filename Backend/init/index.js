const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URL;

const { stocks } = require("./data.js");

const StockMasterModel = require("../model/StockMasterModel.js");
const StockPriceModel = require("../model/StockPriceModel.js");
const HoldingsModel = require("../model/HoldingsModel.js");
const PositionsModel = require("../model/PositionsModel.js");
const OrdersModel = require("../model/OrdersModel.js");
const UserModel = require("../model/UserModel.js");
const TransactionsModel = require("../model/TransactionsModel.js");
const SettlementLogModel = require("../model/SettlementLogModel.js");
const WatchlistModel = require("../model/WatchlistModel.js");

const { hashPassword } = require("../utils/auth.js");

async function initializeDatabase() {
    try {
        console.log("Connecting to database for seeding...");
        await mongoose.connect(uri);
        console.log("Database connection established.");

        // 1. Clear existing collections
        console.log("Clearing all collections...");
        await StockMasterModel.deleteMany({});
        await StockPriceModel.deleteMany({});
        await HoldingsModel.deleteMany({});
        await PositionsModel.deleteMany({});
        await OrdersModel.deleteMany({});
        await UserModel.deleteMany({});
        await TransactionsModel.deleteMany({});
        await SettlementLogModel.deleteMany({});
        await WatchlistModel.deleteMany({});
        console.log("Collections cleared successfully.");

        // 2. Seed StockMaster & StockPrice
        console.log("Seeding StockMaster and StockPrice caches...");
        const masterOps = [];
        const priceOps = [];

        for (const stock of stocks) {
            masterOps.push({
                symbol: stock.symbol,
                companyName: stock.companyName,
                exchange: stock.exchange,
                country: stock.country || "IN",
                sector: stock.sector || "General",
                industry: stock.industry || "General",
                currency: stock.currency || "INR",
                isDynamic: stock.isDynamic || false,
                active: true
            });

            priceOps.push({
                symbol: stock.symbol,
                currentPrice: stock.initialPrice,
                open: stock.open || stock.initialPrice,
                high: stock.high || stock.initialPrice,
                low: stock.low || stock.initialPrice,
                previousClose: stock.previousClose || stock.initialPrice,
                change: stock.change || 0,
                changePercent: stock.changePercent || 0,
                volume: stock.volume || 0,
                lastUpdated: new Date()
            });
        }

        await StockMasterModel.insertMany(masterOps);
        await StockPriceModel.insertMany(priceOps);
        console.log(`Successfully seeded ${stocks.length} StockMaster and StockPrice records.`);

        // 3. Seed Default Demo User
        console.log("Seeding default demo user...");
        const hashedPassword = hashPassword("password123");
        
        const demoUser = new UserModel({
            username: "demouser",
            email: "demo@zerodha.com",
            password: hashedPassword,
            availableBalance: 100000.0 // Default starting mock balance
        });
        await demoUser.save();
        console.log("Default demo user seeded successfully (demo@zerodha.com / password123).");

        console.log("Database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error occurred during database initialization:", err);
        process.exit(1);
    }
}

initializeDatabase();
