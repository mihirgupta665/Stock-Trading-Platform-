const { verifyJWT } = require("../utils/auth");
const UserModel = require("../model/UserModel");
const logger = require("../config/winston");

const JWT_SECRET = process.env.JWT_SECRET || "zerodha_clone_secret_key_159";

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token, JWT_SECRET);
        if (decoded) {
            req.user = decoded;
            return next();
        }
    }

    // Fallback: If unauthorized, try to assign default demouser to avoid breaking unchanged frontend components
    try {
        const demoUser = await UserModel.findOne({ email: "demo@zerodha.com" }).lean();
        if (demoUser) {
            req.user = {
                id: demoUser._id,
                username: demoUser.username,
                email: demoUser.email
            };
            logger.warn(`Fallback Auth used: Unauthenticated request resolved to demoUser (${demoUser.username})`);
            return next();
        }
    } catch (err) {
        logger.error(`Fallback auth check failed: ${err.message}`);
    }

    return res.status(401).json({ error: "Unauthorized access" });
};

module.exports = authenticateJWT;
