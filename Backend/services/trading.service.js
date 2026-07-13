const mongoose = require("mongoose");
const UserModel = require("../model/UserModel");
const OrdersModel = require("../model/OrdersModel");
const PositionsModel = require("../model/PositionsModel");
const HoldingsModel = require("../model/HoldingsModel");
const TransactionsModel = require("../model/TransactionsModel");
const StockPriceModel = require("../model/StockPriceModel");
const StockMasterModel = require("../model/StockMasterModel");
const logger = require("../config/winston");

const USD_TO_INR_RATE = 83.0; // Conversion rate

/**
 * Helper to get current stock price from cache
 */
const getStockPriceInfo = async (symbol) => {
    const priceDoc = await StockPriceModel.findOne({ symbol }).lean();
    if (!priceDoc) {
        throw new Error(`Price data not found for symbol: ${symbol}`);
    }
    return priceDoc;
};

/**
 * Helper to check exchange rate multiplier (Wallet is in USD)
 */
const getExchangeRate = async (symbol) => {
    const master = await StockMasterModel.findOne({ symbol }).lean();
    if (master && !master.isDynamic) {
        // Indian stocks are priced in INR, convert to USD wallet (divide by 83)
        return 1.0 / USD_TO_INR_RATE;
    }
    return 1.0; // US stocks are already in USD
};

/**
 * Execute Buy Order
 */
const buyStock = async (userId, symbol, quantity, customPrice = null) => {
    const session = await mongoose.startSession();
    try {
        let resultOrder;
        await session.withTransaction(async () => {
            const user = await UserModel.findById(userId).session(session);
            if (!user) throw new Error("User not found");

            const stockMaster = await StockMasterModel.findOne({ symbol }).session(session);
            if (!stockMaster) throw new Error(`Stock ${symbol} is not listed in StockMaster`);

            const priceInfo = await getStockPriceInfo(symbol);
            const price = customPrice !== null && customPrice > 0 ? customPrice : priceInfo.currentPrice;

            const rate = await getExchangeRate(symbol);
            const totalAmountUSD = quantity * price * rate;

            const isPending = customPrice !== null && price < priceInfo.currentPrice;

            // 1. Validate Funds
            if (user.availableBalance < totalAmountUSD) {
                throw new Error(`Insufficient funds. Required: $${totalAmountUSD.toFixed(2)}, Available: $${user.availableBalance.toFixed(2)}`);
            }

            // 2. Deduct available balance (Locks funds for both pending and success)
            user.availableBalance -= totalAmountUSD;
            await user.save({ session });

            // 3. Log Order
            const newOrder = new OrdersModel({
                user: userId,
                symbol,
                companyName: stockMaster.companyName,
                exchange: stockMaster.exchange,
                quantity,
                price,
                totalAmount: totalAmountUSD,
                transactionType: "BUY",
                orderType: customPrice ? "LIMIT" : "MARKET",
                status: isPending ? "PENDING" : "SUCCESS"
            });
            resultOrder = await newOrder.save({ session });

            if (!isPending) {
                // 4. Create/Update Active Position
                let position = await PositionsModel.findOne({ user: userId, symbol }).session(session);
                if (position) {
                    const oldTotal = position.quantity * position.averagePrice;
                    const newTotal = quantity * price;
                    position.quantity += quantity;
                    position.averagePrice = (oldTotal + newTotal) / position.quantity;
                    position.currentPrice = priceInfo.currentPrice;
                } else {
                    position = new PositionsModel({
                        user: userId,
                        symbol,
                        companyName: stockMaster.companyName,
                        quantity,
                        averagePrice: price,
                        currentPrice: priceInfo.currentPrice,
                        exchange: stockMaster.exchange
                    });
                }
                await position.save({ session });

                // 5. Create Transaction Audit Log
                const transaction = new TransactionsModel({
                    user: userId,
                    symbol,
                    companyName: stockMaster.companyName,
                    exchange: stockMaster.exchange,
                    quantity,
                    price,
                    totalAmount: totalAmountUSD,
                    transactionType: "BUY",
                    orderType: customPrice ? "LIMIT" : "MARKET",
                    status: "SUCCESS"
                });
                await transaction.save({ session });

                logger.info(`SUCCESS: User ${user.username} bought ${quantity} shares of ${symbol} for $${totalAmountUSD.toFixed(2)}`);
            } else {
                logger.info(`PENDING: Limit Buy Order placed for user ${user.username} - ${quantity} shares of ${symbol} at $${price.toFixed(2)} (LTP is $${priceInfo.currentPrice.toFixed(2)})`);
            }
        });
        return resultOrder;
    } catch (err) {
        logger.error(`Failed to buy stock ${symbol} for user ${userId}: ${err.message}`);
        throw err;
    } finally {
        session.endSession();
    }
};

/**
 * Execute Sell Order
 */
const sellStock = async (userId, symbol, quantity, customPrice = null) => {
    const session = await mongoose.startSession();
    try {
        let resultOrder;
        await session.withTransaction(async () => {
            const user = await UserModel.findById(userId).session(session);
            if (!user) throw new Error("User not found");

            const stockMaster = await StockMasterModel.findOne({ symbol }).session(session);
            if (!stockMaster) throw new Error(`Stock ${symbol} is not listed in StockMaster`);

            const priceInfo = await getStockPriceInfo(symbol);
            const price = customPrice !== null && customPrice > 0 ? customPrice : priceInfo.currentPrice;

            const rate = await getExchangeRate(symbol);
            const totalAmountUSD = quantity * price * rate;

            const isPending = customPrice !== null && price > priceInfo.currentPrice;

            // 1. Validate holdings & positions (total ownership)
            const activePosition = await PositionsModel.findOne({ user: userId, symbol }).session(session);
            const activeHolding = await HoldingsModel.findOne({ user: userId, symbol }).session(session);

            const posQty = activePosition ? activePosition.quantity : 0;
            const holdQty = activeHolding ? activeHolding.quantity : 0;
            const totalOwned = posQty + holdQty;

            if (totalOwned < quantity) {
                throw new Error(`Insufficient shares to sell. Owned: ${totalOwned}, Requested: ${quantity}`);
            }

            // 2. Log Order
            const newOrder = new OrdersModel({
                user: userId,
                symbol,
                companyName: stockMaster.companyName,
                exchange: stockMaster.exchange,
                quantity,
                price,
                totalAmount: totalAmountUSD,
                transactionType: "SELL",
                orderType: customPrice ? "LIMIT" : "MARKET",
                status: isPending ? "PENDING" : "SUCCESS"
            });
            resultOrder = await newOrder.save({ session });

            // 3. Deduct from Position first, then Holding (Locks shares immediately)
            let remainingToSell = quantity;

            if (activePosition && activePosition.quantity > 0) {
                if (activePosition.quantity <= remainingToSell) {
                    remainingToSell -= activePosition.quantity;
                    await PositionsModel.deleteOne({ _id: activePosition._id }).session(session);
                } else {
                    activePosition.quantity -= remainingToSell;
                    remainingToSell = 0;
                    await activePosition.save({ session });
                }
            }

            if (remainingToSell > 0 && activeHolding && activeHolding.quantity > 0) {
                if (activeHolding.quantity <= remainingToSell) {
                    remainingToSell -= activeHolding.quantity;
                    await HoldingsModel.deleteOne({ _id: activeHolding._id }).session(session);
                } else {
                    activeHolding.quantity -= remainingToSell;
                    remainingToSell = 0;
                    await activeHolding.save({ session });
                }
            }

            if (!isPending) {
                // 4. Add proceeds to user's available balance
                user.availableBalance += totalAmountUSD;
                await user.save({ session });

                // 5. Create Transaction Audit Log
                const transaction = new TransactionsModel({
                    user: userId,
                    symbol,
                    companyName: stockMaster.companyName,
                    exchange: stockMaster.exchange,
                    quantity,
                    price,
                    totalAmount: totalAmountUSD,
                    transactionType: "SELL",
                    orderType: customPrice ? "LIMIT" : "MARKET",
                    status: "SUCCESS"
                });
                await transaction.save({ session });

                logger.info(`SUCCESS: User ${user.username} sold ${quantity} shares of ${symbol} for $${totalAmountUSD.toFixed(2)}`);
            } else {
                logger.info(`PENDING: Limit Sell Order placed for user ${user.username} - ${quantity} shares of ${symbol} at $${price.toFixed(2)} (LTP is $${priceInfo.currentPrice.toFixed(2)})`);
            }
        });
        return resultOrder;
    } catch (err) {
        logger.error(`Failed to sell stock ${symbol} for user ${userId}: ${err.message}`);
        throw err;
    } finally {
        session.endSession();
    }
};

/**
 * Check and execute triggered limit/pending orders for a stock when its price updates
 */
const processTriggeredPendingOrders = async (symbol, newPrice) => {
    try {
        const pendingOrders = await OrdersModel.find({ symbol, status: "PENDING" });
        if (pendingOrders.length === 0) return;

        for (const order of pendingOrders) {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    const user = await UserModel.findById(order.user).session(session);
                    if (!user) return;

                    const rate = await getExchangeRate(symbol);

                    if (order.transactionType === "BUY") {
                        // Buy executes when price drops below or equal to limit price
                        if (newPrice <= order.price) {
                            order.status = "SUCCESS";
                            await order.save({ session });

                            let position = await PositionsModel.findOne({ user: order.user, symbol }).session(session);
                            if (position) {
                                const oldTotal = position.quantity * position.averagePrice;
                                const newTotal = order.quantity * order.price;
                                position.quantity += order.quantity;
                                position.averagePrice = (oldTotal + newTotal) / position.quantity;
                                position.currentPrice = newPrice;
                            } else {
                                position = new PositionsModel({
                                    user: order.user,
                                    symbol,
                                    companyName: order.companyName,
                                    quantity: order.quantity,
                                    averagePrice: order.price,
                                    currentPrice: newPrice,
                                    exchange: order.exchange
                                });
                            }
                            await position.save({ session });

                            const transaction = new TransactionsModel({
                                user: order.user,
                                symbol,
                                companyName: order.companyName,
                                exchange: order.exchange,
                                quantity: order.quantity,
                                price: order.price,
                                totalAmount: order.totalAmount,
                                transactionType: "BUY",
                                orderType: "LIMIT",
                                status: "SUCCESS"
                            });
                            await transaction.save({ session });

                            logger.info(`TRIGGERED LIMIT BUY: Order ${order._id} for ${symbol} executed successfully at $${order.price.toFixed(2)}`);
                        }
                    } else if (order.transactionType === "SELL") {
                        // Sell executes when price rises above or equal to limit price
                        if (newPrice >= order.price) {
                            order.status = "SUCCESS";
                            await order.save({ session });

                            user.availableBalance += order.totalAmount;
                            await user.save({ session });

                            const transaction = new TransactionsModel({
                                user: order.user,
                                symbol,
                                companyName: order.companyName,
                                exchange: order.exchange,
                                quantity: order.quantity,
                                price: order.price,
                                totalAmount: order.totalAmount,
                                transactionType: "SELL",
                                orderType: "LIMIT",
                                status: "SUCCESS"
                            });
                            await transaction.save({ session });

                            logger.info(`TRIGGERED LIMIT SELL: Order ${order._id} for ${symbol} executed successfully at $${order.price.toFixed(2)}`);
                        }
                    }
                });
            } catch (innerErr) {
                logger.error(`Error processing pending order ${order._id}: ${innerErr.message}`);
            } finally {
                session.endSession();
            }
        }
    } catch (err) {
        logger.error(`Failed to process pending orders for ${symbol}: ${err.message}`);
    }
};

/**
 * Cancel pending orders older than 24 hours and refund their locked assets
 */
const expireOldPendingOrders = async () => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setHours(cutoffDate.getHours() - 24);

        const expiredOrders = await OrdersModel.find({
            status: "PENDING",
            createdAt: { $lt: cutoffDate }
        });

        if (expiredOrders.length === 0) return;

        logger.info(`Found ${expiredOrders.length} pending orders older than 24h. Starting expiration cleanup...`);

        for (const order of expiredOrders) {
            const session = await mongoose.startSession();
            try {
                await session.withTransaction(async () => {
                    const user = await UserModel.findById(order.user).session(session);
                    if (!user) return;

                    order.status = "CANCELLED";
                    await order.save({ session });

                    if (order.transactionType === "BUY") {
                        // Refund locked funds
                        user.availableBalance += order.totalAmount;
                        await user.save({ session });
                        logger.info(`CANCELLED: Pending Buy ${order._id} expired. Refunded $${order.totalAmount.toFixed(2)} back to user ${user.username}`);
                    } else if (order.transactionType === "SELL") {
                        // Refund locked shares to active positions
                        let position = await PositionsModel.findOne({ user: order.user, symbol: order.symbol }).session(session);
                        if (position) {
                            position.quantity += order.quantity;
                        } else {
                            position = new PositionsModel({
                                user: order.user,
                                symbol: order.symbol,
                                companyName: order.companyName,
                                quantity: order.quantity,
                                averagePrice: order.price,
                                currentPrice: order.price,
                                exchange: order.exchange
                            });
                        }
                        await position.save({ session });
                        logger.info(`CANCELLED: Pending Sell ${order._id} expired. Returned ${order.quantity} shares of ${order.symbol} to user ${user.username}`);
                    }
                });
            } catch (innerErr) {
                logger.error(`Error cancelling expired order ${order._id}: ${innerErr.message}`);
            } finally {
                session.endSession();
            }
        }
    } catch (err) {
        logger.error(`Failed to execute expired orders cron job: ${err.message}`);
    }
};

/**
 * Calculate Portfolio values dynamically (no database persistence)
 */
const calculatePortfolio = async (userId) => {
    try {
        const holdings = await HoldingsModel.find({ user: userId }).lean();
        const positions = await PositionsModel.find({ user: userId }).lean();
        const user = await UserModel.findById(userId).lean();

        if (!user) throw new Error("User not found");

        let totalInvested = 0;
        let totalCurrentValue = 0;
        let todayPnL = 0;

        // Process Holdings
        const updatedHoldings = await Promise.all(holdings.map(async (h) => {
            const priceInfo = await getStockPriceInfo(h.symbol);
            const rate = await getExchangeRate(h.symbol);
            
            const currentPriceUSD = priceInfo.currentPrice * rate;
            const averagePriceUSD = h.averagePrice * rate;

            const investedAmount = averagePriceUSD * h.quantity;
            const marketValue = currentPriceUSD * h.quantity;
            const totalPnL = marketValue - investedAmount;
            
            let totalPnLPercent = 0;
            if (investedAmount > 0) {
                totalPnLPercent = (totalPnL / investedAmount) * 100;
            }

            totalInvested += investedAmount;
            totalCurrentValue += marketValue;
            
            const prevCloseUSD = (priceInfo.previousClose || priceInfo.currentPrice) * rate;
            todayPnL += (currentPriceUSD - prevCloseUSD) * h.quantity;

            return {
                ...h,
                currentPrice: priceInfo.currentPrice,
                investedAmount,
                marketValue,
                totalPnL,
                totalPnLPercent,
                qty: h.quantity,
                avg: h.averagePrice,
                price: priceInfo.currentPrice,
                net: (totalPnL >= 0 ? "+" : "") + totalPnLPercent.toFixed(2) + "%",
                day: (priceInfo.changePercent >= 0 ? "+" : "") + priceInfo.changePercent.toFixed(2) + "%"
            };
        }));

        // Process Positions
        const updatedPositions = await Promise.all(positions.map(async (p) => {
            const priceInfo = await getStockPriceInfo(p.symbol);
            const rate = await getExchangeRate(p.symbol);

            const currentPriceUSD = priceInfo.currentPrice * rate;
            const averagePriceUSD = p.averagePrice * rate;

            const investedAmount = averagePriceUSD * p.quantity;
            const marketValue = currentPriceUSD * p.quantity;
            const unrealizedPnL = marketValue - investedAmount;

            totalInvested += investedAmount;
            totalCurrentValue += marketValue;
            
            const prevCloseUSD = (priceInfo.previousClose || priceInfo.currentPrice) * rate;
            todayPnL += (currentPriceUSD - prevCloseUSD) * p.quantity;

            return {
                ...p,
                currentPrice: priceInfo.currentPrice,
                unrealizedPnL,
                qty: p.quantity,
                avg: p.averagePrice,
                price: priceInfo.currentPrice,
                net: (unrealizedPnL >= 0 ? "+" : "") + ((unrealizedPnL / (investedAmount || 1)) * 100).toFixed(2) + "%",
                day: (priceInfo.changePercent >= 0 ? "+" : "") + priceInfo.changePercent.toFixed(2) + "%"
            };
        }));

        const overallPnL = totalCurrentValue - totalInvested;
        let returnPercent = 0;
        if (totalInvested > 0) {
            returnPercent = (overallPnL / totalInvested) * 100;
        }

        return {
            availableBalance: user.availableBalance,
            totalInvested,
            totalCurrentValue,
            todayPnL,
            overallPnL,
            returnPercent,
            holdings: updatedHoldings,
            positions: updatedPositions
        };
    } catch (err) {
        logger.error(`Portfolio calculation failed for user ${userId}: ${err.message}`);
        throw err;
    }
};

module.exports = {
    buyStock,
    sellStock,
    calculatePortfolio,
    processTriggeredPendingOrders,
    expireOldPendingOrders
};
