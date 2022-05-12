import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as validate from '../validate/registerValidate';
import * as passEmailVer from '../mailer/passverification';
import { Request, Response } from 'express';
import User from '../entity/user';
const genUsername = require("unique-username-generator");

export async function registerPosts(req: Request, res: Response){
    // Validate the data
    const { error } = validate.registerValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});
    
    try{
        // Check if user is in DB
        const result = await User.findOne({ 
            where: [
                { email: req.body.email.trim() },
                { username: req.body.username.toLocaleLowerCase().trim() }
            ],
            select: ['username', 'email']
        });

        if (result) {
            if(result.email == req.body.email)
                return res.status(400).json({error: "Email is already exist"});
            else
                return res.status(400).json({error: "Username is already exist"});
        }       
    } catch(err){
        return res.status(500).json({error: err.message});
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    // Create user for DB
    const { fullName, email, username } = req.body;
    const user = createUser(fullName, email, username);
    user.password = hashpass;

    // Save the user in DB
    try{
        await user.save();
        res.status(200).json({message: "Sign up successfully"});
    } catch(err) {
        res.status(500).json({error: err.message});
    } 
    
};

export async function logInPost(req: Request, res: Response){
    // Validate the data
    const { error } = validate.loginValidation(req.body);
    if (error)
        return res.status(400).json({error: "Email or Password are incorrect"});

    let result: User;
    try{
        // Check if user is in DB
        result = await User.findOne({ 
            where: [
                { email: req.body.username.trim() },
                { username: req.body.username.trim() }
            ],
            select: ['id', 'password', 'username', 'profileImage'] 
        });
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
    
    try{
        if(result && await bcrypt.compare(req.body.password, result.password)){
            const token = createToken(result.id, result.username);
            
            const UserInfo = {
                profileImage: result.profileImage,
                username: result.username,
                auth_token: token                    
            };
            res.status(200).json({UserInfo});
        }
        else{
            res.status(401).json({error: "Email or Password are incorrect"});
        }
    }catch(err){
        res.status(401).json({error: err});
   }
    
};

export async function googleLogIn(req: Request, res: Response){
    let user: User;
    // Create a user
    try{
        user = await User.findOne({
            where:{email: req.body.email.trim()},
            select:['id', 'username', 'profileImage']
        });

        if(!user){
            // Generate username
            const username = await userNameGenerator(req.body.email);

            // Save user in DB
            const { name, email } = req.body;
            const user = createUser(name, email, username);
            user.password = jwt.sign(email, process.env.TOKEN_SECRET)
            await user.save();
        };
    } catch(err) {
        return res.status(500).json({error: err.message});
    };

    if(!user){
        try{
            user = await User.findOne({ 
                where:{ email: req.body.email },
                select: ['id', 'username', 'profileImage']
            });
        } catch(err) {
            return res.status(500).json({error: err.message});
        }
    };

    if(user){
        const token = createToken(user.id, user.username);
        const UserInfo = {
            profileImage: user.profileImage,
            username: user.username,
            auth_token: token                    
        };
        res.status(200).json({UserInfo});
    }
    else{
        res.status(404).send();
    }
};

export async function passwordReset(req: Request, res: Response){

    // Validate the data
    const { error } = validate.emailValidation(req.body);
    if (error)
        return res.status(400).json({error: "Email is not valid"});

    let user: User;
    try{
        user = await User.findOne({ 
            where: { email: req.body.email },
            select: ['id', 'fullName', 'email', 'password']
        });
    } catch(err) {
        return res.status(500).json({error: err.message});
    }

    try{
        await passEmailVer.passResetMail(user);
        res.status(200).json({message:"Email send"});
    }catch(error){
        res.status(400).json({error:"User did not found"});
    }  
};

export async function passUpdate(req: Request, res: Response){
    const pass = {
        password: req.body.password
    };

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
            await User.update({ id: req.body.id },{ password: hashpass });
            res.status(200).send();
        } catch(err) {
            return res.status(500).json({error: err.message});
        }
    }
    else{
        res.status(400).json({error: "The password must be equal"});
    }   
};

//------------------------------- Create functions -----------------------------------
async function userNameGenerator(email: string){
    let username: string;
    let tempUser: Pick<User, 'username'>;
    do {                
        username = genUsername.generateFromEmail(email, 5);
        tempUser = await User.findOne({
            where:{username: username},
            select: ['username']
        });
    } while (tempUser);
    return username;
};

function createUser(fullName: string, email: string, username: string){
    const user = new User();
    user.fullName = fullName;
    user.email = email;
    user.username = username.toLocaleLowerCase();
    user.profileImage = process.env.PROFILE_IMAGE;
    user.themeImage = process.env.THEME_IMAGE;
    return user;
};

export function createToken(id: string, username: string){
    const tokenUser = {
        id: id,
        username: username
    };

    return (jwt.sign(tokenUser, process.env.TOKEN_SECRET));
};