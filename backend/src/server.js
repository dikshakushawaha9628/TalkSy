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
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    credentials: true // Allow cookies to be sent with requests
}))
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser());

const PORT = process.env.PORT || 5002;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// app.get('/api/auth/signup', (req, res) => {
//     res.send('Signup Route');
// });
// app.get('/api/auth/login', (req, res) => {
//     res.send('Login Route');
// });
// app.get('/api/auth/logout', (req, res) => {
//     res.send('Logout Route');
// });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
