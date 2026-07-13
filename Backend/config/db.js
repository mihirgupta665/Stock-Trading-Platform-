const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, {
            maxPoolSize: 10,
        });
        console.log("MongoDB Connection Established");
    } catch (err) {
        console.error("Error while connecting to the database:\n", err);
        process.exit(1);
    }
};

module.exports = connectDB;
