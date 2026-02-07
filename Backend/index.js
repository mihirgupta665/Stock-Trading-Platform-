require('dotenv').config();     // adds the env file to the process of the operating system and all value could be extracted by process.env.key_option
// A JavaScript object provided by Node.js that contains environment variables of the OS process.
const express = require("express");

const mongoose = require("mongoose");
const PORT =process.env.PORT || 3002;      // port could change at the time od deployment so we need to specify the same
const uri = process.env.MONGO_URL;          // after ? name of teh database msut be written and password english word must be replaced by real password


const app = express();


app.listen(PORT, async ()=>{
    console.log("App started");
    await mongoose.connect(uri)
    .then(()=>{
        console.log("MongoDb Connention Established")
    })
    .catch( (err) => {
        console.log("Error while connecting to the database\n"+err);
    });
});