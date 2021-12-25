const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const validate = require ('../validate/registerValidate')
const passEmailVer = require ('../mailer/passverification');
const pool = require('../config/database'); 


exports.registerPosts = async (req, res) =>{
    let errMessage = "";

    console.log("here")
    // Validate the data
    const { error } = validate.registerValidation(req.body);
    if (error){
        return res.status(400).json({error: error.details[0].message});
    }
    
    try{
        // Check if user is in DB
        const email = await pool.query(`SELECT email FROM users WHERE email='${req.body.email}'`)
        const username = await pool.query(`SELECT username FROM users WHERE username='${req.body.username}'`)

        const err = username.rows[0] || email.rows[0];
        if (err)
            return res.status(400).json({error: err})
    } catch(error){
        console.log("controller/signinsignup line 25", error)
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashpass = await bcrypt.hash(req.body.password, salt);
    const text = "INSERT INTO users(id, full_name, email, username, password) VALUES(uuid_generate_v4(),$1,$2,$3,$4)";
    const values = [req.body.full_name, req.body.email , req.body.username, hashpass];
    
    // Save the user in DB
    try{
        await pool.query(text,values);
        console.log("new user");
        res.status(200).json({message: "Sign up successfully"});
    } catch(err) {
        console.log("controller/signinsignup line 42", err)
    } 
    
};

// exports.logInPost = async (req, res) =>{

//     let errMessage = "";

//     // Validate the data
//     const { error } = validate.loginValidation(req.body);
//     if (error){
//         return res.status(400).json({error: error.details[0].message});
//     }

//     await User.findOne({email: req.body.username})
//         .then(async (user) =>{
//             if (!user){
//                 errMessage = "Email or Password are incorrect"
//                 return res.status(401).json({error: errMessage})
//             }

//             else if (await bcrypt.compare(req.body.password, user.password)){
//                 const tokenUser = {
//                     id: user._id,
//                     connect: "menual"
//                 }
//                 const token = await jwt.sign(tokenUser, process.env.TOKEN_SECRET);
//                 const UserInfo = {
//                     username: user.username,
//                     auth_token: token                    
//                 }
//                 res.status(200).json({UserInfo});
//             } else {
//                 errMessage = "Email or Password are incorrect"
//                 return res.status(401).json({error: errMessage})
//             }
//         })
//         .catch((e) =>{
//             console.log(e, "the error from line 86 in controller/signinsignup")
//             res.status(400).json({error: "Email or Password are incorrect"})
//         })
// };

// exports.googleLogIn = async (req, res) =>{
//     let errMessage = "";
//     console.log(req.body);
//     // Create a user
//     await User.findOne({email: req.body.email})
//     .then(async (user) => {
//         if (!user){
//             const newUser = new User({
//                 username: req.body.name,
//                 email: req.body.email,
//                 fullname: req.body.name
//             });

//             // Validate the data
//             const { error } = validate.googleValidation(newUser);
//             if (error){
//                 return res.json({error: error.details[0].message});
//             }

//             await newUser.save()
//             .then((user) => console.log("Saved the google user"))
//             .catch((e) =>{
//                 console.log(e, "the error from line 115 in controller/signinsignup")
//                 res.status(400).json({error: "could not save user"})
//             })
//         }
//     })
//     .catch((e) =>{
//         console.log(e, "the error from line 117 in controller/signinsignup")
//         res.status(400).json({error: "could not find user"})
//     })

//     // Search for user again to get the id for token create
//     await User.findOne({email: req.body.email})
//         .then(async (user) =>{
//             if (!user){
//                 errMessage = "There was an error with user sign"
//                 return res.status(400).json({error: errMessage})
//             } else {
//                 const tokenUser = {
//                     id: user._id,
//                     connect: "google"
//                 }
//                 const token = await jwt.sign(tokenUser, process.env.TOKEN_SECRET);
//                 const UserInfo = {
//                     username: user.username,
//                     auth_token: token                    
//                 }
//                 res.status(200).json({UserInfo});
//             }
//         })
//         .catch((e) =>{
//             console.log(e, "the error from line 134 in controller/signinsignup")
//             res.status(400).json({error: "could not find user"})
//         })
// };



// exports.passwordReset = async (req, res) =>{

//     // Validate the data
//     const { error } = validate.emailValidation(req.body)
//     if (error){
//         return res.status(400).json({error: error.details[0].message});
//     }

//     await User.findOne({email: req.body.email})
//     .then(async (user) => {
//         if (user){
//             if (passEmailVer.passResetMail(user)){
//                 console.log("send mail")
//                 res.status(200).json({message:"email send"});
//             } else {
//                 console.log("error with send mail")
//                 res.status(400).json({error:"email did not send"})
//             }
//         }else{
//             res.status(200).json({message:"email send"});
//         }
        
//     })
//     .catch((e) =>{
//         console.log(e, "the error from line 174 in controller/signinsignup")
//         res.status(400).json({error: "could not find user"})
//     })

    
// };

// exports.passUpdate = async (req, res) => {
//     const pass = {
//         password: req.body.password
//     }

//     // Validate the data
//     const { error } = validate.passwordValidation(pass)
//     if (error){
//         return res.status(400).json({error: error.details[0].message});
//     }

//     if (req.body.password == req.body.passwordConfirm){

//         // Hash the password
//         const salt = await bcrypt.genSalt(12);
//         const hashpass = await bcrypt.hash(req.body.password, salt);

//         await User.updateOne({_id: req.user.id}, {$set:{password: hashpass}})

//         res.status(200).json({message: "the password updated successfully"})
//     }
//     else{
//         res.status(400).json({error: "the password must be equal"})
//     }
    
// }

// exports.s = (req, res) =>{
//     res.status(200).json({user: req.user});
    
// };