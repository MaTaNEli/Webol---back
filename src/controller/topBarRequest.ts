import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager } from 'typeorm';
import User from '../entity/user';
import Notifications from '../entity/notifications';
import { deeplyFilterUser, fixString } from './globalPagesRequests';
import Follow from '../entity/follow';
import Post from '../entity/post';

const AMOUNT = 20;
export async function findPosts(req: Request, res: Response){
    try{
        const subQ = getManager()
        .createQueryBuilder(User,"user")
        .leftJoinAndSelect(Follow, 'f', 'user.id = f.followerId')
        .select('f.userId')
        .where(`user.id = '${req['user'].id}'`);

        const result = await getManager()
        .getRepository(Post)
        .createQueryBuilder("post")     
        .leftJoinAndSelect("post.user", "u")
        .where("post.user IN (" + subQ.getQuery() + ")")
        .andWhere("post.description like :description",
            { description:`%${req.params.description.toLocaleLowerCase()}%`})
        .orWhere(`post.user = '${req['user'].id}'`)
        .orderBy('post.id','DESC')
        .limit(AMOUNT).offset(+req.params.offset)
        .select('post.description')
        .addSelect('post.id')
        .addSelect('u.profileImage')
        .addSelect('u.displayUsername')
        .distinct(true)
        .getMany() 
  
        for (let [ key, value ] of Object.entries(result))
            if(value.description)
                value.description = value.description.substring(0,20) + '...';

        res.status(201).json(result);
        
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function findUsersByRole(req: Request, res: Response){
    const role = fixString(req.params.username)
    try{
        const user = await getManager()
        .createQueryBuilder(User,"user")
        .where("user.role like :name", { name:`%${role}%`})
        .select('user.displayUsername')
        .addSelect('user.profileImage')
        .orderBy('username','ASC')
        .limit(20).offset(+req.params.offset)
        .getMany();

        const result = deleteUserInSearch(user, req['user'].username)

        res.status(201).json(result);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

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

        const result = deleteUserInSearch(user, req['user'].username)

        res.status(201).json(result);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
};

export async function countNotifications(req: Request, res: Response){
    try{
        const notification =  await getManager()
        .getRepository(Notifications)
        .createQueryBuilder("notification")
        .where(`notification.userConnect = '${req['user'].id}'`)
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
        await Notifications.update({ userConnect: req['user'].id, read: false },{ read: true });
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