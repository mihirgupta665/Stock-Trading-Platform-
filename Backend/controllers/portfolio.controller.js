const { buyStock, sellStock, calculatePortfolio } = require("../services/trading.service");
const { settlePositions } = require("../services/settlement.service");
const OrdersModel = require("../model/OrdersModel");
const TransactionsModel = require("../model/TransactionsModel");
const logger = require("../config/winston");

const getHoldings = async (req, res, next) => {
    try {
        const portfolio = await calculatePortfolio(req.user.id);
        return res.json(portfolio.holdings);
    } catch (err) {
        next(err);
    }
};

const getPositions = async (req, res, next) => {
    try {
        const portfolio = await calculatePortfolio(req.user.id);
        return res.json(portfolio.positions);
    } catch (err) {
        next(err);
    }
};

const getOrders = async (req, res, next) => {
    try {
        const orders = await OrdersModel.find({ user: req.user.id })
            .sort("-createdAt")
            .lean();
        return res.json(orders);
    } catch (err) {
        next(err);
    }
};

const placeOrder = async (req, res, next) => {
    const { symbol, quantity, price, transactionType } = req.body;
    const userId = req.user.id;

    try {
        let order;
        if (transactionType === "BUY") {
            order = await buyStock(userId, symbol, quantity, price);
        } else {
            order = await sellStock(userId, symbol, quantity, price);
        }
        return res.status(201).json({
            message: "Order executed successfully!",
            order
        });
    } catch (err) {
        next(err);
    }
};

const getDashboardStats = async (req, res, next) => {
    try {
        const portfolio = await calculatePortfolio(req.user.id);
        const UserModel = require("../model/UserModel");
        const user = await UserModel.findById(req.user.id).lean();
        
        return res.json({
            availableBalance: portfolio.availableBalance,
            totalInvested: portfolio.totalInvested,
            totalCurrentValue: portfolio.totalCurrentValue,
            todayPnL: portfolio.todayPnL,
            overallPnL: portfolio.overallPnL,
            returnPercent: portfolio.returnPercent,
            totalDeposited: user ? (user.totalDeposited || 0.0) : 0.0
        });
    } catch (err) {
        next(err);
    }
};

const getTransactions = async (req, res, next) => {
    try {
        const transactions = await TransactionsModel.find({ user: req.user.id })
            .sort("-createdAt")
            .lean();
        return res.json(transactions);
    } catch (err) {
        next(err);
    }
};

const triggerSettlement = async (req, res, next) => {
    try {
        await settlePositions();
        return res.json({ message: "Position-to-Holding settlement completed successfully!" });
    } catch (err) {
        next(err);
    }
};

const adjustFunds = async (req, res, next) => {
    const { amount, action } = req.body;
    try {
        const UserModel = require("../model/UserModel");
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const numVal = Number(amount);
        if (isNaN(numVal) || numVal <= 0) {
            return res.status(400).json({ error: "Invalid amount specified" });
        }

        if (action !== "withdraw") {
            return res.status(400).json({ error: "Deposit must be initiated via Razorpay checkout" });
        }

        if (user.availableBalance < numVal) {
            return res.status(400).json({ error: "Insufficient balance for withdrawal" });
        }

        user.availableBalance -= numVal;
        await user.save();

        // Record WITHDRAWAL transaction log
        const transaction = new TransactionsModel({
            user: user._id,
            symbol: "USD",
            companyName: "Withdrawal from Wallet",
            exchange: "LEDGER",
            quantity: 1,
            price: numVal,
            totalAmount: numVal,
            transactionType: "WITHDRAWAL",
            orderType: "MARKET",
            status: "SUCCESS"
        });
        await transaction.save();

        logger.info(`FUNDS WITHDRAWAL: User ${user.username} withdrew $${numVal.toFixed(2)}. New balance: $${user.availableBalance.toFixed(2)}`);
        
        return res.json({ 
            message: "Withdrawal completed successfully!", 
            availableBalance: user.availableBalance,
            totalDeposited: user.totalDeposited
        });
    } catch (err) {
        next(err);
    }
};

const createRazorpayOrder = async (req, res, next) => {
    const { amount } = req.body;
    try {
        const val = Number(amount);
        if (isNaN(val) || val <= 0) {
            return res.status(400).json({ error: "Invalid amount specified" });
        }

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        // Bypassing logic for local testing with placeholder values
        if (keyId === "rzp_test_placeholderKey" || !keySecret || keySecret === "placeholderSecret") {
            const mockOrderId = "order_mock_" + Math.random().toString(36).substring(2, 15);
            return res.json({
                key: keyId,
                amount: val * 83 * 100, // in paise
                currency: "INR",
                order_id: mockOrderId,
                isMock: true
            });
        }

        // Real Razorpay Order Creation via Native fetch
        const amountINR = Math.round(val * 83 * 100); // 83 INR per USD, convert to paise
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        
        const response = await fetch("https://api.razorpay.com/v1/orders", {
            method: "POST",
            headers: {
                "Authorization": `Basic ${auth}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: amountINR,
                currency: "INR",
                receipt: "receipt_" + Date.now()
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.description || "Razorpay API error");
        }

        const data = await response.json();

        return res.json({
            key: keyId,
            amount: amountINR,
            currency: "INR",
            order_id: data.id,
            isMock: false
        });
    } catch (err) {
        next(err);
    }
};

const verifyRazorpayPayment = async (req, res, next) => {
    const { order_id, payment_id, signature, amount, isMock } = req.body;
    try {
        const val = Number(amount); // in USD

        // Validate Signature
        if (!isMock) {
            const crypto = require("crypto");
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            
            const hmac = crypto.createHmac("sha256", keySecret);
            hmac.update(order_id + "|" + payment_id);
            const generatedSignature = hmac.digest("hex");
            
            if (generatedSignature !== signature) {
                return res.status(400).json({ error: "Payment verification failed" });
            }
        }

        // Update User Wallet
        const UserModel = require("../model/UserModel");
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.availableBalance += val;
        user.totalDeposited = (user.totalDeposited || 0.0) + val;
        await user.save();

        // Record DEPOSIT transaction log
        const transaction = new TransactionsModel({
            user: user._id,
            symbol: "USD",
            companyName: "Deposit via Razorpay",
            exchange: "LEDGER",
            quantity: 1,
            price: val,
            totalAmount: val,
            transactionType: "DEPOSIT",
            orderType: "MARKET",
            status: "SUCCESS"
        });
        await transaction.save();

        logger.info(`FUNDS DEPOSIT: User ${user.username} deposited $${val.toFixed(2)} via Razorpay. Order: ${order_id}, Payment: ${payment_id}`);

        return res.json({
            message: "Deposit completed successfully!",
            availableBalance: user.availableBalance,
            totalDeposited: user.totalDeposited
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
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
};
