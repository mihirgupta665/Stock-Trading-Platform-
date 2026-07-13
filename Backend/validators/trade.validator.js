const Joi = require("joi");

const tradeSchema = Joi.object({
    symbol: Joi.string().required().messages({
        "any.required": "Stock symbol is required"
    }),
    quantity: Joi.number().integer().positive().required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.positive": "Quantity must be a positive number",
        "any.required": "Quantity is required"
    }),
    price: Joi.number().min(0).allow(null).optional().messages({
        "number.min": "Price must be a non-negative number"
    }),
    transactionType: Joi.string().valid("BUY", "SELL").required().messages({
        "any.only": "Transaction type must be BUY or SELL",
        "any.required": "Transaction type is required"
    })
});

/**
 * Helper to check if market is open in Asia/Kolkata (7:00 PM to 1:30 AM IST)
 * and calculate the remaining time until opening.
 */
const checkMarketOpenIST = () => {
    const tz = "Asia/Kolkata";
    const now = new Date();
    
    // Format the current hour and minute in Asia/Kolkata timezone
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "numeric",
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === "hour").value, 10);
    const minute = parseInt(parts.find(p => p.type === "minute").value, 10);
    
    const currentMins = hour * 60 + minute;
    
    // Open: 7:00 PM IST (19:00 * 60 = 1140 minutes)
    // Close: 1:30 AM IST (1 * 60 + 30 = 90 minutes) of next day
    const openMins = 19 * 60; // 1140
    const closeMins = 1 * 60 + 30; // 90
    
    // Market is open if current time is >= 7:00 PM (1140) OR current time is < 1:30 AM (90)
    const isOpen = currentMins >= openMins || currentMins < closeMins;
    
    let countdownMessage = "";
    if (!isOpen) {
        let diffMins;
        if (currentMins < openMins) {
            diffMins = openMins - currentMins;
        } else {
            diffMins = (24 * 60 - currentMins) + openMins;
        }
        
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        countdownMessage = `Exchange opens after ${hrs}h ${mins}m`;
    }
    
    return {
        isOpen,
        countdownMessage
    };
};

const validateTrade = (req, res, next) => {
    // 1. Enforce open market hours check (7:00 PM to 1:30 AM IST daily, including weekends!)
    const marketCheck = checkMarketOpenIST();
    if (!marketCheck.isOpen) {
        return res.status(400).json({ error: marketCheck.countdownMessage });
    }

    // Map legacy inputs (name, qty, mode) to standard schema parameters
    const payload = {
        symbol: req.body.symbol || req.body.name,
        quantity: req.body.quantity || req.body.qty,
        price: req.body.price !== undefined ? req.body.price : null,
        transactionType: req.body.transactionType || req.body.mode
    };

    const { error, value } = tradeSchema.validate(payload);
    
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    // Standardize input body parameter keys for downstream logic
    req.body.symbol = value.symbol.toUpperCase();
    req.body.quantity = value.quantity;
    req.body.price = value.price;
    req.body.transactionType = value.transactionType.toUpperCase();

    next();
};

module.exports = {
    validateTrade
};
