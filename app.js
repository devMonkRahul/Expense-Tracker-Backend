import express from 'express';
import connectDB from "./server/config/db.config.js";
import { config } from "./server/constants.js";
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import CookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(CookieParser());

connectDB()
    .then(() => {
        app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
        app.on("error", (error) => {
            console.log("Error on the server: ", error);
            throw error;
        });
    })
    .catch((error) => console.log("MongoDB Connection Failed: ", error));

app.get("/", (req, res) => {
    return res.status(200).json({ 
        success: true,
        message: "Server is running" 
    });
});

// Import routes
import userRoutes from "./server/routes/user.routes.js";

app.use("/api/v1/users", userRoutes);
