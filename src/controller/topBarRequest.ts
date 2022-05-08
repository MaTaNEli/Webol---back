import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager } from 'typeorm';
import User from '../entity/user';
import Notification from '../entity/notification';

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
            const user = await User.findOne({where: {id: userConnect}, select : ['profileImage', 'username']});
            await creatNotification(message, userId, postId, user.profileImage, user.username).save();
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