const Joi = require ('@hapi/joi')
const bcrypt = require ("bcryptjs");
const jwt = require ('jsonwebtoken');
const { registerValidation } = require ('../validate/registerValidate')

const connection = require('../config/database');
const User = connection.models.User;


//const passport = require ('passport');
//var qs = require('querystring');


exports.registerPosts = async (req, res) =>{
    let errMessage = ""
    // Validate the data
    const { error } = registerValidation(req.body);

    console.log(error)
    if (error){
        return res.json({error: error.details[0].message});
    }


    // Check if user is in DB
    await User.findOne({email: req.body.email})
    .then((user) =>{
        if (user){
            errMessage = "email is already sign in";
        } 
    })
    .catch (e => console.log(e, "Error in find user in db line 29 controller/signInSignUp"));
    
    if (errMessage == ""){

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashpass = await bcrypt.hash(req.body.password, salt);

        // Create a user
        const newUser = new User({
            username: req.body.username,
            password: hashpass,
            email: req.body.email,
            fullname: req.body.fullname,
            logedin: false
        })

        try{
            // Save the user in DB
            await newUser.save().then((user) => console.log("saved the user"))
            return res.status(200).json({user: "Sign in successfully"});
        } catch (err) {
            console.log(err)
            return res.status(400).json({error: "there is error chatch line 52 in controller/signInSignUp"});
        }
    } else {
        return res.status(200).json({error, errMessage});
    }
};


exports.logInPost = async (req, res) =>{

    let userInfo = {};
    if (req.body.username){
        console.log("controller/signinsignup line 67");  
    }

    if (!userInfo){
        return res.status(401).json({error: "could not find user"})
    } 

    if (await bcrypt.compare(req.body.password, userInfo.password)){
        const token = await jwt.sign({id: userInfo.id}, process.env.TOKEN_SECRET);
        console.log("controller/signinsignup line 76");
        res.status(200).header('auth-token', token).json({token});
    } else {
        console.log("controller/signinsignup line 79");
        res.status(401).json({error: "password incorrect"});
    }
};

exports.loginFailed = (req, res) =>{
    const error = {
        logedin: false, 
        message: "Username or Password is incorrect"
    }
    res.status(401).json(error)
};

exports.loginSuccess = (req, res) =>{
    console.log(req.session.passport, "supose to be a user")
    User.findById(req.session.passport.user)
    .then((result) =>{
        const user = {
            name: result.username,
            email: result.email
        }
        console.log("loginSuccess function in controller/signinsignup")
        return res.status(200).json({user:user})
    })
    .catch(e => console.log(e))
};

exports.logout = (req, res) =>{
    req.logout();
    req.session.destroy();
    res.status(200).json({message: 'logged out successfully'})
};

exports.s = (req, res) =>{
    //res.status(200).json({matan: 'matan'})
    //res.setHeader("set-cookie", ["matan"]);
    //let user = {}
    if (req.session.viewCount)
    {
        req.session.viewCount++
    } else {
        req.session.viewCount = 1;
    }
    // if(req.user && req.user.id)
    //     user = DB.searcIdInDB(req.user.id)

    // if (user)
    //     res.status(200).json({fullname: user.full_name, session: req.session.viewCount});
    // else{
    //     //return res.redirect('/logout');
        res.status(200).json({session: req.session.viewCount});
    //}    
};


