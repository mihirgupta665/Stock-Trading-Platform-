
require("dotenv").config();   // adds the env file to the process of the operating system and all value could be extracted by process.env.key_option
// A JavaScript object provided by Node.js that contains environment variables of the OS process.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const HoldingsModel = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const OrdersModel = require("./model/OrdersModel");
const UserModel = require("./model/UserModel");
const { hashPassword, verifyPassword, signJWT, authenticateJWT } = require("./utils/auth");

const PORT = process.env.PORT || 3002;       // port could change at the time od deployment so we need to specify the same
const uri = process.env.MONGO_URL;          // after ? name of teh database msut be written and password english word must be replaced by real password
const JWT_SECRET = process.env.JWT_SECRET || "zerodha_clone_secret_key_159";

const app = express();

app.use(cors());
app.use(bodyParser.json());

async function startServer() {
    try {
        // DATABASE CONNECTION 
        await mongoose
            .connect(uri)
            .then(() => {
                console.log("MongoDB Connection Established");
            })
            .catch((err) => {
                console.error("Error while connecting to the database:\n", err);
                process.exit(1); // stop app if DB fails
            });

        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}`);
        });

    } catch (err) {
        console.error("Unexpected application crash:\n", err);
        process.exit(1);
    }
}
startServer();

// Authentication Endpoints
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: "Username or Email already registered" });
        }

        // Hash password and create user
        const hashedPassword = hashPassword(password);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        // Sign token
        const token = signJWT({ id: newUser._id, username: newUser.username, email: newUser.email }, JWT_SECRET);
        return res.json({ token, username: newUser.username });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ error: "Server error during registration" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordCorrect = verifyPassword(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = signJWT({ id: user._id, username: user.username, email: user.email }, JWT_SECRET);
        return res.json({ token, username: user.username });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error during login" });
    }
});

app.get("/user", authenticateJWT, async (req, res) => {
    return res.json({ user: req.user });
});

// App Data Endpoints
app.get("/allHoldings", async (req, res) => {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions", async (req, res)=> {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.get("/allOrders", async (req, res) => {
    let allOrders = await OrdersModel.find({});
    res.json(allOrders);
});

app.post("/newOrder", async (req, res)=>{
    try {
        let newOrder = new OrdersModel({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode,
        });

        await newOrder.save();
        res.send("Order got saved!");
    } catch (err) {
        console.error("Error saving order:", err);
        res.status(500).send("Error saving order");
    }
});
