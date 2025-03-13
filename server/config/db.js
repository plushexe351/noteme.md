require("dotenv").config();

const mongoose = require("mongoose");

const MONGO_CONN_URL = process.env.MONGO_CONN_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_CONN_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
