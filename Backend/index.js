
require("dotenv").config();   // adds the env file to the process of the operating system and all value could be extracted by process.env.key_option
// A JavaScript object provided by Node.js that contains environment variables of the OS process.
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const HoldingsModel = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const OrdersModel = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;       // port could change at the time od deployment so we need to specify the same
const uri = process.env.MONGO_URL;          // after ? name of teh database msut be written and password english word must be replaced by real password

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

app.get("/allHoldings", async (req, res) => {
    allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions",async (req, res)=> {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.post("/newOrder", async (req, res)=>{
    let newOrder = new OrdersModel({
        
    });

});
