import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager } from 'typeorm';
import User from '../entity/user';
import Notification from '../entity/notification';

export async function findUsers(req: Request, res: Response){
    try{
        const user = await getManager()
        .createQueryBuilder(User,"user")
        .where("user.username like :name", { name:`%${req.params.username.toLocaleLowerCase()}%`})
        .select('user.displayUsername')
        .addSelect('user.profileImage')
        .orderBy('username','ASC')
        .limit(20).offset(+req.params.offset)
        .getMany();

        const resulte = deleteUserInSearch(user, req['user'].username)

        res.status(201).json(resulte);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function countNotifications(req: Request, res: Response){
    try{
        const notification =  await getManager()
        .getRepository(Notification)
        .createQueryBuilder("notification")
        .where(`notification.userId = '${req['user'].id}'`)
        .andWhere('notification.read = false')
        .getCount()

        res.status(201).json(notification);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function getNotifications(req: Request, res: Response){
    try{
        const notification =  await getManager()
        .getRepository(Notification)
        .createQueryBuilder("notification")
        .orderBy('id','DESC')
        .limit(5)
        .where(`notification.userId = '${req['user'].id}'`)
        .select('notification.read', 'read')
        .addSelect('notification.message', 'message')
        .addSelect('notification.profileImage', 'profileImage')
        .addSelect('notification.postId', 'postId')
        .addSelect('notification.user', 'user')
        .execute()

        await Notification.update({ userId: req['user'].id, read: false },{ read: true });
        res.status(201).json(notification);
        
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//------------------------------- Notifications functions -----------------------------------
export async function addNotification (message: string, userId: string, postId: string, userConnect: string){
    if(!(userConnect === userId)){
        try{
            const user = await User.findOne({where: {id: userConnect}, select : ['profileImage', 'displayUsername']});
            await creatNotification(message, userId, postId, user.profileImage, user.displayUsername).save();
        }catch(err){
            console.log('error with the notification save on controller/globalPageRequest:',err.message);
        }
    }
};

function creatNotification(message: string, userId: string, postId: string, profileImage: string, name: string){
    const notification = new Notification;
    notification.message = message;
    notification.userId = userId;
    notification.postId = postId;
    notification.profileImage = profileImage;
    notification.user = name;
    notification.read = false;
    return notification;
}

function deleteUserInSearch(user:User[], username:string){
    for (let [ key, value ] of Object.entries(user))
        if(value.displayUsername === username)
            user.splice(+key, +key)
    return user;
}