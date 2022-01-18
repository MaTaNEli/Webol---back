import dotenv from 'dotenv';
import 'reflect-metadata'
import express, { NextFunction } from 'express';
import cors from 'cors';
import { initStorage } from './storage';
import User from './entity/user';

// Access to veriables set in the .env file via 'process.env.VERIABLE_NAME'
dotenv.config();

// Creat the Express application
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cors({credentials: true, origin: '*'}));

// Fetch all the routes for the application
import signInSignUp from './routes/signInSignUp';
import userRequest from './routes/userRequest';
import s3 from './routes/s3';

function errHandler(err, req, res, next){
    console.log("in app.js line 28");
    res.json({error: err});
}

// Routes
app.use('/', signInSignUp);
app.use('/user', userRequest);
app.use('/s3', s3);

//Get all the err without crash
app.use(errHandler);

// Server listen on http//localhost:3000
(async () => {
    await initStorage();
    app.listen(3000, () => console.log('Server is running'));
})();
