const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require('../config/database');
const validate = require ('../validate/registerValidate')
const passEmailVer = require ('../mailer/passverification');
const { getMaxListeners } = require('../config/database');


exports.registerPosts = async (req, res) =>{
    let errMessage = "";
    // Validate the data
    const { error } = validate.registerValidation(req.body);

    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    // Check if user is in DB
    await User.findOne({email: req.body.email})
    .then((user) =>{
        if (user){
            errMessage = "email is already in use";
        } 
    })
    .catch((e) =>{
        console.log(e, "the error from line 26 in controller/signinsignup")
        res.status(400).json({error: "could not find user"})
    })
    
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
        res.status(400).json({error: errMessage});
    }
};

exports.logInPost = async (req, res) =>{

    let errMessage = "";

    // Validate the data
    const { error } = validate.loginValidation(req.body);

    //console.log(req.header('auth-token'));
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    await User.findOne({email: req.body.username})
        .then(async (user) =>{
            if (!user){
                errMessage = "Email or Password are incorrect"
                return res.status(401).json({error: errMessage})
            }

            else if (await bcrypt.compare(req.body.password, user.password)){
                const token = await jwt.sign({id: user._id}, process.env.TOKEN_SECRET);
                const UserInfo = {
                    username: user.username,
                    auth_token: token                    
                }
                res.status(200).json({UserInfo});
            } else {
                errMessage = "Email or Password are incorrect"
                return res.status(401).json({error: errMessage})
            }
        })
        .catch((e) =>{
            console.log(e, "the error from line 86 in controller/signinsignup")
            res.status(400).json({error: "could not find user"})
        })
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

            const { error } = validate.googleValidation(newUser);

            //console.log(req.header('auth-token'));
            if (error){
                return res.json({error: error.details[0].message});
            }

            await newUser.save().then((user) => console.log("Saved the google user"));
        }
    })
    .catch((e) =>{
        console.log(e, "the error from line 117 in controller/signinsignup")
        res.status(400).json({error: "could not find user"})
    })

    // Search for user again to get the id for token create
    await User.findOne({email: req.body.email})
        .then(async (user) =>{
            if (!user){
                errMessage = "There was an error with user sign"
                return res.status(400).json({error: errMessage})
            } else {
                const token = await jwt.sign({id: user.id}, process.env.TOKEN_SECRET);
                const UserInfo = {
                    username: user.username,
                    auth_token: token                    
                }
                res.status(200).json({UserInfo});
            }
        })
        .catch((e) =>{
            console.log(e, "the error from line 134 in controller/signinsignup")
            res.status(400).json({error: "could not find user"})
        })
};



exports.passwordReset = async (req, res) =>{
    const { error } = validate.emailValidation(req.body)

    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    await User.findOne({email: req.body.email})
    .then(async (user) => {
        if (user){
            if (passEmailVer.passResetMail(user)){
                console.log("send mail")
                res.status(200).json({message:"email send"});
            } else {
                console.log("error with send mail")
                res.status(400).json({error:"email did not send"})
            }
        }else{
            res.status(200).json({message:"email send"});
        }
        
    })
    .catch((e) =>{
        console.log(e, "the error from line 174 in controller/signinsignup")
        res.status(400).json({error: "could not find user"})
    })

    
};

exports.passUpdate = async (req, res) => {
    const pass = {
        password: req.body.password
    }
    const { error } = validate.passwordValidation(pass)

    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    if (req.body.password == req.body.passwordConfirm){

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashpass = await bcrypt.hash(req.body.password, salt);

        await User.updateOne({_id: req.user.id}, {$set:{password: hashpass}})

        res.status(200).json({message: "the password updated successfully"})
    }
    else{
        res.status(400).json({error: "the password must be equal"})
    }
    
}

exports.s = (req, res) =>{

    res.status(200).json({user: req.user});
    
};