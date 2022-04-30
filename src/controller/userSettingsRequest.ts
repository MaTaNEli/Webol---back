import { Request, Response } from 'express';
import User from '../entity/user';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import * as validate from '../validate/postAndComment';
import { fullNameValidation, newPasswordValidation, userNameValidation } from '../validate/userValidate';

// Update the user profile image or theme image
export async function updateUserImage(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ [req.params.image]: req.body.imgurl });
        res.status(201).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Update the bio
export async function updateBio(req: Request, res: Response){
    const { error } = validate.addBioValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        await User.update({ id: req['user'].id },{ bio: req.body.bio.trim() });
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

// Update the username
export async function updateUsername(req: Request, res: Response){
    const { error } = userNameValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        await User.update({ id: req['user'].id },{ username: req.body.username.trim() });
        res.status(201).send();
    }catch(err) {
        return res.status(400).json({error: 'Username is already exist'});
    }
};

// Update the Full name
export async function updateFullname(req: Request, res: Response){
    const { error } = fullNameValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        await User.update({ id: req['user'].id },{ fullName: req.body.fullName.trim()});
        res.status(201).send();
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};

// Update the password
export async function updatePassword(req: Request, res: Response){
    const { error } = newPasswordValidation(req.body);
    if (error)
        return res.status(400).json({error: error.details[0].message});

    try{
        const user = await User.findOne({where: {id: req['user'].id}, select : ['password']});
        if (await bcrypt.compare(req.body.oldPassword, user.password))
        {
            await User.update({ id: req['user'].id },{ password: req.body.newPass.trim()});
            res.status(201).send();
        }else
            return res.status(400).json({error: 'Password is incorrect'});
        
    }catch(err) {
        return res.status(500).json({error: err.message});
    }
};