import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './database/db.js';
dotenv.config();

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
// middlewares

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

// routes

import authRouter from './routes/auth.routes.js'

app.use("/api/v1",authRouter)


const port=process.env.PORT || 8001;

// database connection and app starting
connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
