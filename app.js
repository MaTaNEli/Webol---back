const express = require ('express');
const dotenv = require ('dotenv');
const passport = require ('passport');
const cookieSession = require('cookie-session');
const flash = require('express-flash')
const session = require('express-session')

dotenv.config();

//Fetch all the routes
//const feedRoutes = require('./routes/feed');
const signInSignUp = require('./routes/signInSignUp');



const app = express();
app.use(express.json());


app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/', signInSignUp);


app.listen(8080, () => console.log('Server is running'));