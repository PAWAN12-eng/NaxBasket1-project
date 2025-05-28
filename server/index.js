import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from 'morgan';
import helmet from 'helmet';
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";    
import connectDB from './config/connectDB.js';
import userouter from './route/user.route.js';
import uploadRouter from './route/upload.route.js';

const app = express();
app.use(cors({
    credentials: true,
    origin: 5173
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

  

app.get('/', (req, res) => {
    res.send("Server is running on port 1117");
});

app.use('/api/user', userouter);
app.use('/file',uploadRouter)

const port = process.env.PORT || 1117;

connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server is running on port", port);
    });
});
