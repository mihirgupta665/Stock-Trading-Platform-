const express = require("express");
const router = express.Router();
const {
    getMarketStatus,
    getCompanyDetails,
    getStockHistory,
    getNews,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getPriceList
} = require("../controllers/stock.controller");
const authenticateJWT = require("../middleware/auth.middleware");

router.get("/market/status", getMarketStatus);
router.get("/company/:symbol", getCompanyDetails);
router.get("/history/:symbol", getStockHistory);
router.get("/news", getNews);
router.get("/allPrices", getPriceList);

// Watchlist endpoints protected by JWT middleware
router.get("/watchlist", authenticateJWT, getWatchlist);
router.post("/watchlist", authenticateJWT, addToWatchlist);
router.delete("/watchlist/:symbol", authenticateJWT, removeFromWatchlist);

module.exports = router;
