import express from 'express';
import connectDB from "./server/config/db.config.js";
import { config } from "./server/constants.js";
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import CookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

const app = express();

// Create logs directory if it doesn't exist
const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Create a write stream (append mode) for logging requests
const accessLogStream = fs.createWriteStream(path.join(logDirectory, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

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

// Route to check if server is running
app.get("/", (req, res) => {
    return res.status(200).json({ 
        success: true,
        message: "Server is running" 
    });
});

// Route to fetch last 100 lines of logs
app.get("/logs", (req, res) => {
    const logFilePath = path.join(logDirectory, 'access.log');

    // Read last 100 lines from the log file
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error reading log file" });
        }

        const lines = data.trim().split("\n");
        const last100Lines = lines.slice(-100).join("\n");

        res.setHeader('Content-Type', 'text/plain');
        res.send(last100Lines);
    });
});

// Import routes
import userRoutes from "./server/routes/user.routes.js";
import transactionRoutes from "./server/routes/transaction.routes.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/transaction", transactionRoutes);