import { Request, Response } from 'express';
import User from '../entity/user';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import * as validate from '../validate/userValidate';
import { createToken } from './signInSignUp';
import { fixString } from './globalPagesRequests';
import { getManager } from 'typeorm';
import Roles from '../entity/roles';

// get the user profile information
export async function getUserInfo(req: Request, res: Response){
    try{
        const user = await User.findOne({where: {id: req['user'].id}, select : ['fullName', 'bio']});
        res.status(201).send(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// get the user profile information
export async function getProfileInfo(req: Request, res: Response){
    try{
        const user = await User.findOne({where: {id: req['user'].id}, select : ['role', 'isPrivate', 'price']});
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

export async function updateUserPrice(req: Request, res: Response){
    try{
        await User.update({ id: req['user'].id },{ price: +req.body.price });
        res.status(201).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

export async function updateUserPrivateSetting(req: Request, res: Response){
    try{
        
        await getManager()
        .createQueryBuilder()
        .update(User)
        .set({
            isPrivate: req.body.isPrivate,
            price: req.body.isPrivate? 0 : null
        })
        .where(`id = '${req['user'].id}'`)
        .execute();
       
        res.status(201).send();
    } catch(err) {
        res.status(500).json({error: err.message});
    }
};

// Update the user profile image or theme image
export async function updateRole(req: Request, res: Response){
    const role = await Roles.findOne({where: {name:req.params.role}})
    if(role){
        try{
            await User.update({ id: req['user'].id },{ role: req.params.role });
            res.status(201).send();
        } catch(err) {
            res.status(500).json({error: err.message});
        }
    }else{
        res.status(400).json({error: "Unvalide role"});
    }
    
};

// Update the user profile image or theme image
export async function getRoles(req: Request, res: Response){
    const stringRole = fixString(req.params.role)
    try{
        const role = await getManager()
        .createQueryBuilder(Roles,"roles")
        .where("roles.name like :name", { name:`%${stringRole}%`})
        .select('roles.name')
        .orderBy('name','ASC')
        .limit(20).offset(+req.params.offset)
        .distinct()
        .getMany();

        const arr: Array<string> = [];
        role.map(k=> arr.push(k.name))
        res.status(200).json(arr);

    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

// Update the settings of the user - password, username, fullname and bio.
export async function updateSettings(req: Request, res: Response){
    const errorMessage = {bio: null, fullName: null, password: null, username: null}
    validateTheInput(req.body, errorMessage);

    const data = dinamicData(req.body);
    let username: User;
    try{
        if(data.username)
            username = await User.findOne({where: {username: data.username}, select : ['displayUsername']});
        if(username && username.displayUsername != req['user'].username)
            errorMessage.username = 'Username is already exist';

        const user = await User.findOne({where: {id: req['user'].id}, select : ['password', 'displayUsername']});
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
        
        const token = createToken(req['user'].id, data.username? data.displayUsername : user.displayUsername);
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
        displayUsername: input['username'],
        password: input['newPassword']
    };
    
    if (!updateData.bio) 
        delete updateData.bio;

    if (!updateData.fullName)
        delete updateData.fullName;
    
    if (!updateData.username){
        delete updateData.username;
        delete updateData.displayUsername;
    }
    else
        updateData.username = updateData.username.toLocaleLowerCase();
    

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