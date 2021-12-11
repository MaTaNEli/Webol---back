const bcrypt = require ("bcryptjs");
const jwt = require ('jsonwebtoken');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;

const initializePassport = require('../local_sign')



const DB = [];

const findEmail = (email) => {
    const user = DB.find(user => user.email === email);
    return user;
}

const findID = (id) => {
   const user = DB.find(user => user.id === id);
   return user;
}

initializePassport(passport, findEmail, findID);

exports.registerPosts = async (req, res) =>{

    //check if user is in DB

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = {
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashpass,
    };
    
    try{
        //save the user in DB
        DB.push(user);
        res.status(200).json({user: user});
    }catch(err){
        res.status(400).json(err);
    }
};

exports.logInPost = async (req, res) => {

    //creat a token
    const token = jwt.sign({_id: req.user.id}, process.env.TOKEN_S)
    res.header('auth-token', token).json(token);
}; 