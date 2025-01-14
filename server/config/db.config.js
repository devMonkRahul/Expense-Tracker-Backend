import mongoose from "mongoose";
import { config } from "../constants.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.uri)
        console.log("Database connected...");
    } catch (error) {
        console.log("Error connecting to the database: ", error);
        process.exit(1);
    }
}

export default connectDB;