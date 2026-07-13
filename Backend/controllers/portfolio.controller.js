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

        if (action === "withdraw") {
            if (user.availableBalance < numVal) {
                return res.status(400).json({ error: "Insufficient balance for withdrawal" });
            }
            user.availableBalance -= numVal;
        } else {
            user.availableBalance += numVal;
            user.totalDeposited = (user.totalDeposited || 0.0) + numVal;
        }

        await user.save();
        logger.info(`FUNDS UPDATE: User ${user.username} performed ${action} of $${numVal.toFixed(2)}. New balance: $${user.availableBalance.toFixed(2)}, Cumulative Deposit: $${(user.totalDeposited || 0.0).toFixed(2)}`);
        
        return res.json({ 
            message: `Successfully completed ${action}!`, 
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
    adjustFunds
};
