const bcrypt = require ("bcryptjs");
const jwt = require ('jsonwebtoken');
const User = require('../config/database');
const { registerValidation, loginValidation } = require ('../validate/registerValidate')

//var qs = require('querystring');

exports.registerPosts = async (req, res) =>{
    let errMessage = ""
    // Validate the data
    const { error } = registerValidation(req.body);

    //console.log(req.header('auth-token'));
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

    let errMessage = "";

    // Validate the data
    const { error } = loginValidation(req.body);

    //console.log(req.header('auth-token'));
    if (error){
        return res.json({error: error.details[0].message});
    }

   await User.findOne({email: req.body.username})
        .then(async (user) =>{
            if (!user){
                errMessage = "Email or Password are incorrect"
                return res.status(200).json({error: errMessage})
            }


            else if (await bcrypt.compare(req.body.password, user.password)){
                const token = await jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
                const UserInfo = {
                    username: user.username,
                    auth_token: token                    
                }
                res.status(200).json({UserInfo});
            } else {
                errMessage = "Email or Password are incorrect"
                return res.status(200).json({error: errMessage})
            }
        }).catch(e => console.log(e));

        if (errMessage != ""){
            console.log("/controller/signinsignup line 84")
            res.status(200).json({error: errMessage})
        }
};

exports.googleLogIn = async (req, res) =>{
    let errMessage = "";
    console.log(req.body);
    // Create a user

    await User.findOne({email: req.body.email})
    .then(async (user) => {
        if (!user){
            const newUser = new User({
                username: req.body.name,
                password: "google_Authentication",
                email: req.body.email,
                fullname: req.body.name
            });
            await newUser.save().then((user) => console.log("saved the user"));
        }
    });

    await User.findOne({email: req.body.email})
        .then(async (user) =>{
            if (!user){
                errMessage = "There was an error with user sign"
                return res.status(200).json({error: errMessage})
            } else {
                const token = await jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
                const UserInfo = {
                    username: user.username,
                    auth_token: token                    
                }
                res.status(200).json({UserInfo});
            }
        })
};





exports.s = (req, res) =>{
    console.log(req.user);

    res.status(200).json({user: req.user});
    
};


