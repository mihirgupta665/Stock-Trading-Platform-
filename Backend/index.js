

require("dotenv").config();   // adds the env file to the process of the operating system and all value could be extracted by process.env.key_option
// A JavaScript object provided by Node.js that contains environment variables of the OS process.
const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3002;       // port could change at the time od deployment so we need to specify the same
const uri = process.env.MONGO_URL;          // after ? name of teh database msut be written and password english word must be replaced by real password

const app = express();

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

        const HoldingsModel = require("./model/HoldingsModel");

        app.listen(PORT, () => {
            console.log(`App started on port ${PORT}`);
        });

    } catch (err) {
        console.error("Unexpected application crash:\n", err);
        process.exit(1);
    }
}

startServer();
