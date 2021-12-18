const express = require ('express');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require ('cors');

//const connection = require('./config/database');
//const client = require('./database/connectDB');

// Package documentation - https://www.npmjs.com/package/connect-mongo
var MongoStore = require('connect-mongo')
// const conn = process.env.DB_STRING;

// const connect = mongoose.createConnection(conn, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//});
// Access to veriables set in the .env file via 'process.env.VERIABLE_NAME'
require ('dotenv').config();

// Creat the Express application
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// app.use((req, res, next) =>{
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

//const sessionStore = new MongoStore({ mongooseConnection: connect, collection: 'sessions' });


// Setup the session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DB_STRING}),
    cookie: {maxAge: 1000 * 60 * 60 * 24, secure: false}
}))

app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//     console.log(req.session, "session");
//     console.log(req.user, "user");
//     next();
// });

// Require the passport
require('./config/passport');

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