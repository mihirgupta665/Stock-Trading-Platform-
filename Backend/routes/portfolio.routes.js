const express = require("express");
const router = express.Router();
const {
    getHoldings,
    getPositions,
    getOrders,
    placeOrder,
    getDashboardStats,
    getTransactions,
    triggerSettlement,
    adjustFunds,
    createRazorpayOrder,
    verifyRazorpayPayment
} = require("../controllers/portfolio.controller");
const { validateTrade } = require("../validators/trade.validator");
const authenticateJWT = require("../middleware/auth.middleware");

// Core dashboard endpoints (protected by authenticateJWT with fallback support)
router.get("/allHoldings", authenticateJWT, getHoldings);
router.get("/allPositions", authenticateJWT, getPositions);
router.get("/allOrders", authenticateJWT, getOrders);
router.post("/newOrder", authenticateJWT, validateTrade, placeOrder);

// Advanced dynamic calculations and operations
router.get("/portfolio/dashboard", authenticateJWT, getDashboardStats);
router.get("/portfolio/transactions", authenticateJWT, getTransactions);
router.post("/portfolio/settle", authenticateJWT, triggerSettlement); // Manual trigger
router.post("/portfolio/funds", authenticateJWT, adjustFunds); // Withdrawal
router.post("/portfolio/funds/order", authenticateJWT, createRazorpayOrder); // Create Razorpay Order
router.post("/portfolio/funds/verify", authenticateJWT, verifyRazorpayPayment); // Verify Razorpay Payment

module.exports = router;
