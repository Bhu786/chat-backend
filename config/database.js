import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // Additional options can be specified here if needed
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
};

export default connectDB;
