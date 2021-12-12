const bcrypt = require ("bcryptjs");
const jwt = require ('jsonwebtoken');
const passport = require ('passport');
const DB = require ('../config/database')
var qs = require('querystring');


exports.registerPosts = async (req, res) =>{
    console.log(req.body);

    //check if user is in DB
    //hash the password
    if(!req.body.password){
        console.log("if you are here we have a problem")
        return res.status(200).json('its not good no data')
        
    }

    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    
    //create user
    const user = {
        id: Date.now().toString(),
        full_name: req.body.fullname,
        name: req.body.username,
        email: req.body.email,
        password: hashpass,
    };
    
    try{
        //save the user in DB
        await DB.addToDB(user);
        res.status(200).json({user: user});
    }catch(err){
        res.status(400).json(err);
    }
};


exports.logInPost = async (req, res) =>{

    //check if user is in DB
    //hash the password
    res.status(200).json('success to login');
};

exports.notSignIn = async (req, res) =>{
    const response = {
        "signin": false
    }
    res.status(201).json(response);
};