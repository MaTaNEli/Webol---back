const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const validate = require ('../validate/registerValidate');
const passEmailVer = require ('../mailer/passverification');
const pool = require('../config/database'); 


exports.registerPosts = async (req, res) =>{
    // Validate the data
    const { error } = validate.registerValidation(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }
    
    try{
        // Check if user is in DB
        const email = await pool.query(`SELECT email FROM users WHERE email='${req.body.email}'`);

        if (email.rows[0]) {
            return res.status(400).json({error: "Email is already exist"});
        }
            
    } catch(error){
        console.log("controller/signinsignup line 25", error);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    // Create query for DB
    const text = "INSERT INTO users(id, full_name, email, password) VALUES(uuid_generate_v4(),$1,$2,$3)";
    const values = [req.body.full_name, req.body.email , hashpass];
    
    // Save the user in DB
    try{
        await pool.query(text,values);
        console.log("New user registered");
        res.status(200).json({message: "Sign up successfully"});
    } catch(err) {
        console.log("controller/signinsignup line 42", err);
    } 
    
};

exports.logInPost = async (req, res) =>{
    // Validate the data
    const { error } = validate.loginValidation(req.body);
    if (error){
        return res.status(400).json({error: "Email or Password are incorrect"});
    }

    let user;
    try{
        // Check if user is in DB
        user = await pool.query(`SELECT * FROM users WHERE email='${req.body.email}'`);
    } catch(err) {
        console.log("controller/signinsignup line 81", err);
    }

    if(user.rows[0] && await bcrypt.compare(req.body.password, user.rows[0].password)){ 
        const tokenUser = {
            id: user.rows[0].id,
            manualConnect: true
        }

        const token = jwt.sign(tokenUser, process.env.TOKEN_SECRET);
        const UserInfo = {
            full_name: user.rows[0].full_name,
            auth_token: token                    
        }
        console.log("User loged in");
        res.status(200).json({UserInfo});
    }
    else{
        res.status(401).json({error: "Email or Password are incorrect"});
    }
};

exports.googleLogIn = async (req, res) =>{
    let user;
    // Create a user
    try{
        // request id insted of all line
        user = await pool.query(`SELECT * FROM users WHERE email='${req.body.email}'`);
        if(!user.rows[0]){
            // Save user in DB
            const text = "INSERT INTO users(id, full_name, email) VALUES(uuid_generate_v4(),$1,$2)";
            const values = [req.body.name, req.body.email];
            await pool.query(text,values);
        };
    } catch(err) {
        console.log("controller/signinsignup line 98", err);
    };

    if(!user.rows[0]){
        try{
            // request id insted of all line
            user = await pool.query(`SELECT * FROM users WHERE email='${req.body.email}'`);
        } catch(err) {
            console.log("controller/signinsignup line 111", err);
        }
    }

    if(user.rows[0]){
        const tokenUser = {
            id: user.rows[0].id,
            manualConnect: false
        };
        const token = await jwt.sign(tokenUser, process.env.TOKEN_SECRET);
        const UserInfo = {
            full_name: user.full_name,
            auth_token: token                    
        };
        console.log("User loged in with google");
        
        res.status(200).json({UserInfo});
    }
    else{
        res.status(400).json({error: "There war a poblem with the google sign"});
    }
};

exports.passwordReset = async (req, res) =>{

    // Validate the data
    const { error } = validate.emailValidation(req.body);
    if (error){
        return res.status(400).json({error: "Email is not valid"});
    }

    let user;
    try{
        user = await pool.query(`SELECT * FROM users WHERE email='${req.body.email}'`);
    } catch(err) {
        console.log("controller/signinsignup line 111", err);
    }

    if (user.rows[0] && passEmailVer.passResetMail(user.rows[0])){
        res.status(200).json({message:"Email send"});
    } else {
        res.status(400).json({error:"User did not found"});
    }    
};

exports.passUpdate = async (req, res) => {
    const pass = {
        password: req.body.password
    }

    // Validate the data
    const { error } = validate.passwordValidation(pass);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }

    if (req.body.password == req.body.passwordConfirm){

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashpass = await bcrypt.hash(req.body.password, salt);

        try{
            await pool.query(`UPDATE users SET password = '${hashpass}' WHERE id = '${req.body.id}'`);
            res.status(200).json({message: "The password updated successfully"});
        } catch(err) {
            console.log("controller/signinsignup line 165", err);
        }
    }
    else{
        res.status(400).json({error: "The password must be equal"});
    }   
};

// exports.s = (req, res) =>{
//     res.status(200).json({user: req.user});
    
// };