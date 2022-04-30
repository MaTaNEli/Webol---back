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
import globalRequest from './routes/globalRequest';
import userSettings from './routes/userSetting';
import s3 from './routes/s3';

function errHandler(req: Request, res: Response){
    res.status(404).json({error: "Sorry could not find the page"});
}

// Routes
app.use('/s3', s3);
app.use('/', signInSignUp);
app.use('/user', userRequest);
app.use('/update', userSettings);
app.use('/global', globalRequest);

//Get all the err without crash
app.use(errHandler);

async () =>{ 
    await getConnection().close();
};

export default app;