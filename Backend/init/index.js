const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app =express();

const uri = process.env.MONGO_URL;
const PORT = process.env.PORT || 3002;

const { holdings, positions} = require("./data.js");

const HoldingsModel = require("../model/HoldingsModel.js");
const PositionsModel = require("../model/PositionsModel.js");

async function serverInitializeDatabase(){
    try{
        await mongoose.connect(uri)
            .then(()=>{
                console.log("Database connected Established");
            })
            .catch(() => {
                console.log("Error occured while connecting to the database");
                process.exit(1);
            });

            // console.log(HoldingsModel);
            await HoldingsModel.deleteMany({});
            await PositionsModel.deleteMany({});

            await HoldingsModel.insertMany(holdings);
            await PositionsModel.insertMany(positions);
            console.log("Database seeded Successfully");
        
            app.listen(PORT,()=>{
                console.log("Sever Started at Port : "+PORT)
            });
    }
    catch(err){
        console.log("Error Occured\n"+err);
    }
}

serverInitializeDatabase();
