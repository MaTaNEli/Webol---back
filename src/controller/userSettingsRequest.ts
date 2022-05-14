import { Request, Response } from 'express';
import User from '../entity/user';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import * as validate from '../validate/userValidate';
import { createToken } from './signInSignUp';

// get the user profile information
export async function getUserInfo(req: Request, res: Response){
    try{
        const user = await User.findOne({where: {id: req['user'].id}, select : ['fullName', 'bio']});
        res.status(201).send(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Update the user profile image or theme image
export async function updateUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(201).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Update the settings of the user - password, username, fullname and bio.
export async function updateSettings(req: Request, res: Response){
    const errorMessage = {bio: null, fullName: null, password: null, username: null}
    validateTheInput(req.body, errorMessage);

    const data = dinamicData(req.body);

    if(data.username)
        data.username = data.username.toLocaleLowerCase();
    
    try{
        const username = await User.findOne({where: {username: req.body.username}, select : ['username']});
        if(username && username.username != req['user'].username)
            errorMessage.username = 'Username is already exist';

        const user = await User.findOne({where: {id: req['user'].id}, select : ['password', 'username']});
        if(data.password){
            if (await bcrypt.compare(req.body.password, user.password) && !errorMessage.password){
                const salt = await bcrypt.genSalt(12);
                const hashpass = await bcrypt.hash(data.password, salt);
                data['password'] = hashpass;
                await User.update({ id: req['user'].id }, data);
                
            }else{
                if(!errorMessage.password)
                    errorMessage.password = 'Password is incorrect';
                return res.status(400).json(errorMessage);
            }
                
        }else
            await User.update({ id: req['user'].id }, data);
        
        const token = createToken(req['user'].id, data.username? data.username : user.username);
        const UserInfo = {
            username: user.username,
            auth_token: token                    
        };
        res.status(200).send(UserInfo);
        
    }catch{
        return res.status(400).json(errorMessage);
    }
};

//------------------------------- Local functions -----------------------------------
function dinamicData(input: Object){
    const updateData = {
        bio: input['bio'],
        fullName: input['fullName'],
        username: input['username'],
        password: input['newPassword']
    };
    
    if (!updateData.bio) 
        delete updateData.bio;

    if (!updateData.fullName)
        delete updateData.fullName;
    
    if (!updateData.username) 
        delete updateData.username;

    if (!updateData.password)
        delete updateData.password;
    
    return updateData;
}

function validateTheInput(input: Object, errorMessage: any){
    if(input['bio']){
        const { error } = validate.addBioValidation({bio: input['bio']});
        if (error)
            errorMessage.bio =  error.details[0].message;
    }

    if(input['username']){
        const { error } = validate.userNameValidation({username: input['username']});
        if (error)
            errorMessage.username = error.details[0].message;
    }

    if(input['fullName']){
        const { error } = validate.fullNameValidation({fullName: input['fullName']});
        if (error)
            errorMessage.fullName =  error.details[0].message;
    }

    if(input['password'] || input['newPassword'] || input['passwordConfirmation']){
        const data = {
            password: input['password'],
            newPassword: input['newPassword'],
            passwordConfirmation: input['passwordConfirmation']}
        const { error } = validate.newPasswordValidation(data);
        if (error)
            errorMessage.password = error.details[0].message;
        else if(input['newPassword'] != input['passwordConfirmation'])
            errorMessage.password =  'The password confirmation does not match';
    }
}