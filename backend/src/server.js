import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
// import chatRoutes from './routes/chat.route.js';
import { upsertStreamUser } from './lib/stream.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js';
import { connectDB } from './lib/db.js';
import cors from 'cors';

const app = express(); 
app.use(cors({
    origin: process.env.FRONTEND_URL , // Adjust this to your frontend URL
    credentials: true // Allow cookies to be sent with requests
}))
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());

const PORT = process.env.PORT || 5002;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
