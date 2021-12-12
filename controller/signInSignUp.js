const bcrypt = require ("bcryptjs");
const jwt = require ('jsonwebtoken');
const passport = require ('passport');


const DB = [];


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
