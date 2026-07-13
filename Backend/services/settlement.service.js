const mongoose = require("mongoose");
const PositionsModel = require("../model/PositionsModel");
const HoldingsModel = require("../model/HoldingsModel");
const SettlementLogModel = require("../model/SettlementLogModel");
const logger = require("../config/winston");

/**
 * End-of-Day Settlement Engine: Merges daily Positions into Holdings
 */
const settlePositions = async () => {
    const session = await mongoose.startSession();
    logger.info("Starting Daily Position-to-Holding Settlement...");

    const logDetails = [];
    let positionsSettledCount = 0;

    try {
        await session.withTransaction(async () => {
            // 1. Fetch all active positions
            const positions = await PositionsModel.find({}).session(session);
            
            if (positions.length === 0) {
                logger.info("No open positions found to settle.");
                return;
            }

            for (const position of positions) {
                // 2. Look up existing holding for this user and symbol
                let holding = await HoldingsModel.findOne({
                    user: position.user,
                    symbol: position.symbol
                }).session(session);

                if (holding) {
                    // Weighted Average Price Calculation
                    const oldTotal = holding.quantity * holding.averagePrice;
                    const newTotal = position.quantity * position.averagePrice;
                    holding.quantity += position.quantity;
                    holding.averagePrice = (oldTotal + newTotal) / holding.quantity;
                    holding.currentPrice = position.currentPrice;
                    
                    logDetails.push({
                        user: position.user,
                        symbol: position.symbol,
                        action: "MERGED",
                        previousQuantity: holding.quantity - position.quantity,
                        addedQuantity: position.quantity,
                        newQuantity: holding.quantity
                    });
                } else {
                    // Create new holding
                    holding = new HoldingsModel({
                        user: position.user,
                        symbol: position.symbol,
                        companyName: position.companyName,
                        quantity: position.quantity,
                        averagePrice: position.averagePrice,
                        currentPrice: position.currentPrice,
                        exchange: position.exchange
                    });

                    logDetails.push({
                        user: position.user,
                        symbol: position.symbol,
                        action: "CREATED",
                        quantity: position.quantity
                    });
                }

                await holding.save({ session });
                
                // 3. Delete settled Position
                await PositionsModel.deleteOne({ _id: position._id }).session(session);
                positionsSettledCount++;
            }

            logger.info(`Successfully settled ${positionsSettledCount} positions.`);
        });

        // Write SUCCESS Log
        const settlementLog = new SettlementLogModel({
            status: "SUCCESS",
            positionsSettledCount,
            details: logDetails
        });
        await settlementLog.save();
        logger.info("Daily Settlement log written successfully.");

    } catch (err) {
        logger.error(`Daily Position Settlement failed: ${err.message}`);
        
        // Write FAILED Log
        try {
            const settlementLog = new SettlementLogModel({
                status: "FAILED",
                positionsSettledCount: 0,
                error: err.message,
                details: logDetails
            });
            await settlementLog.save();
        } catch (logErr) {
            logger.error(`Failed to write settlement error log: ${logErr.message}`);
        }
        
        throw err;
    } finally {
        session.endSession();
    }
};

module.exports = {
    settlePositions
};
