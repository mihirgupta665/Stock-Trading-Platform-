const UserModel = require("../model/UserModel");
const { hashPassword, verifyPassword, signJWT } = require("../utils/auth");
const logger = require("../config/winston");

const JWT_SECRET = process.env.JWT_SECRET || "zerodha_clone_secret_key_159";

const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] }).lean();
        if (existingUser) {
            return res.status(400).json({ error: "Username or Email already registered" });
        }

        const hashedPassword = hashPassword(password);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            availableBalance: 100000.0 // Default starting mock balance
        });
        
        await newUser.save();
        
        const token = signJWT({
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }, JWT_SECRET);

        logger.info(`User registered successfully: ${newUser.username}`);
        return res.status(201).json({ token, username: newUser.username });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordCorrect = verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = signJWT({
            id: user._id,
            username: user.username,
            email: user.email
        }, JWT_SECRET);

        logger.info(`User logged in successfully: ${user.username}`);
        return res.json({ token, username: user.username });
    } catch (err) {
        next(err);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password").lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json({ user });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signup,
    login,
    getUserProfile
};
