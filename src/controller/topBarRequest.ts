import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager } from 'typeorm';
import User from '../entity/user';
import Notifications from '../entity/notification';
import { deeplyFilterUser } from './globalPagesRequests';

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
        .getRepository(Notifications)
        .createQueryBuilder("notification")
        .where(`notification.user = '${req['user'].id}'`)
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
        .getRepository(Notifications)
        .createQueryBuilder("notification")
        .where(`notification.userConnect = '${req['user'].id}'`)
        .leftJoinAndSelect("notification.user", 'user')
        .orderBy('notification.id','DESC')
        .limit(5)
        
        .getMany()

        const info = deeplyFilterUser(notification, req['user'].username.toLocaleLowerCase());
        await Notifications.update({ user: req['user'].id, read: false },{ read: true });
        res.status(201).json(info);
        
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

//------------------------------- Notifications functions -----------------------------------
export async function addNotification (message: string, userId: string, postId: string, userConnect: string){
    if(!(userConnect === userId)){
        try{
            const notification = new Notifications;
            notification.message = message;
            notification.postId = postId;
            notification.userConnect = userId;
            notification.user = userConnect;
            notification.read = false;
            await notification.save();
        }catch(err){
            console.log('error with the notification save on controller/globalPageRequest:',err.message);
        }
    }
};

function deleteUserInSearch(user:User[], username:string){
    let users = []
    for (let [ key, value ] of Object.entries(user))
        if(value.displayUsername != username)
            users.push(value)
            
    return users;
}