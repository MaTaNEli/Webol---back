import express, { Response, Request } from 'express';
import cors from 'cors';
import { getConnection } from "typeorm"

// Creat the Express application
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: '*'}));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


// Fetch all the routes for the application
import signInSignUp from './routes/signInSignUp';
import userRequest from './routes/userRequest';
import s3 from './routes/s3';

function errHandler(err, req: Request, res: Response){
    res.json({error: "There is an error in app.js line 21", err});
}

// Routes
app.use('/', signInSignUp);
app.use('/user', userRequest);
app.use('/s3', s3);

//Get all the err without crash
app.use(errHandler);

async () =>{
    console.log("dbngb")    
    await getConnection().close();
};

export default app;