import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/messageRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const corsOption = {
    origin: 'https://chatfrontend-bqi6.onrender.com',
    credentials: true
};
app.use(cors(corsOption));

// Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening at port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to the database', error);
});
