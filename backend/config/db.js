import mongoose from "mongoose";

const delay = (milliseconds) =>
    new Promise((resolve) => setTimeout(resolve, milliseconds));

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not set");
    }

    let retryDelay = 1000;

    while (mongoose.connection.readyState !== 1) {
        try {
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.error(
                `MongoDB connection failed: ${error.message}. Retrying in ${retryDelay / 1000}s.`,
            );
            await delay(retryDelay);
            retryDelay = Math.min(retryDelay * 2, 30000);
        }
    }

    return mongoose.connection;
};