import mongoose from 'mongoose';
import dns from 'node:dns';
import dotenv from 'dotenv';

dotenv.config();

dns.setDefaultResultOrder('ipv4first');

const RETRY_MS = 3000;
const MAX_ATTEMPTS = 5;

export const connectDB = async () => {
    const uri = process.env.MONGO_URI?.trim();
    if (!uri) {
        throw new Error('MONGO_URI is not set. Add it to backend/.env');
    }

    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            const conn = await mongoose.connect(uri);
            console.log(`MongoDB connected successfully: ${conn.connection.host}`);
            return;
        } catch (error) {
            lastError = error;
            console.error(`MongoDB connection failed (attempt ${attempt}/${MAX_ATTEMPTS}):`, error);
            if (error.code === 'ECONNREFUSED' && error.syscall === 'querySrv') {
                console.error(
                    'SRV lookup for mongodb+srv was refused (DNS/network). Try: turn off VPN, ' +
                    'use a different DNS (e.g. 8.8.8.8), allow outbound DNS, or in Atlas use the ' +
                    'standard "mongodb://" connection string instead of mongodb+srv.'
                );
            }
            if (attempt < MAX_ATTEMPTS) {
                await new Promise((r) => setTimeout(r, RETRY_MS));
            }
        }
    }
    throw lastError;
};
