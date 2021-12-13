const express = require ('express');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const cors = require ('cors');

// Access to veriables set in the .env file via 'process.env.VERIABLE_NAME'
require ('dotenv').config();

// Creat the Express application
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

// app.use((req, res, next) =>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


// Require the passport
require('./config/passport');

app.use(flash());

// Setup the session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}))

app.use(passport.initialize());
app.use(passport.session());

// Fetch all the routes for the application
const signInSignUp = require('./routes/signInSignUp');

// function errHandler(err, req, res, next){
//     res.json({err: err})
// }

// Routes
app.use('/', signInSignUp);

// Get all the err without crash
//app.use(errHandler);

// Server listen on http//localhost:3000
app.listen(3000, () => console.log('Server is running'));