const express = require ('express');
const dotenv = require ('dotenv');
const passport = require ('passport');
const cookieSession = require('cookie-session');
const flash = require('express-flash')
const session = require('express-session')
require ('./google_setup');

dotenv.config();

//Fetch all the routes
//const feedRoutes = require('./routes/feed');
const signInSignUp = require('./routes/signInSignUp');
const googleSign = require('./routes/googleSign');



const app = express();
app.use(express.json());

app.use(cookieSession({
    name: 'Webol',
    keys: ['key1', 'key2']
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// app.post('/login',  passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   }))

app.use('/', signInSignUp);
app.use('/', googleSign);
//app.use('/webol', feedRoutes);

app.listen(8080, () => console.log('Server is running'));