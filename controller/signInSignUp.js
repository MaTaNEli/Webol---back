const bcrypt = require ("bcryptjs");
const jwt = require ('jsonwebtoken');
//const passport = require ('passport');
const DB = require ('../config/database')
//var qs = require('querystring');


exports.registerPosts = async (req, res) =>{
    console.log(req.body);

    //check if user is in DB

    //hash the password
    if(!req.body.password){
        return res.status(200).json({error: "there is no password"})
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

    let userInfo = {};
    if (req.body.username){
        console.log("1");
        userInfo = DB.searcInDB(req.body.username)
    }

    if (!userInfo){
        return res.status(401).json({error: "could not find user"})
    } 

    if (await bcrypt.compare(req.body.password, userInfo.password)){
        const token = await jwt.sign({id: userInfo.id}, process.env.TOKEN_SECRET);
        console.log("2");
        res.status(200).header('auth-token', token).json({token});
    } else {
        console.log("3");
        res.status(401).json({error: "password incorrect"});
    }
    
};

exports.loginFailed = (req, res) =>{
    res.status(401).json("could not loggin")
};

exports.loginSuccess = (req, res) =>{
    res.status(200).json("you are log in")
};

exports.logout = (req, res) =>{
    req.logout();
    req.session.destroy();
    res.status(200).json({message: 'logged out successfully'})
};

exports.s = (req, res) =>{
    //res.status(200).json({matan: 'matan'})
    //res.setHeader("set-cookie", ["matan"]);
    let user = {}
    if (req.session.viewCount)
    {
        req.session.viewCount++
    } else {
        req.session.viewCount = 1;
    }
    if(req.user && req.user.id)
        user = DB.searcIdInDB(req.user.id)

    if (user)
        res.status(200).json({fullname: user.full_name, session: req.session.viewCount});
    else{
        //return res.redirect('/logout');
        res.status(200).json({session: req.session.viewCount});
    }    
};


