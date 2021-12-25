const express = require ('express');
const mongoose = require('mongoose');
const cors = require ('cors');


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


// app.use((req, res, next) => {
//     console.log(req.session, "session");
//     console.log(req.user, "user");
//     next();
// });


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