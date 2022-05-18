import { Request, Response } from 'express';
import _ from 'lodash';
import { getManager } from 'typeorm';
import Messages from '../entity/messages';
import User from '../entity/user';
import { deeplyFilterUser } from './globalPagesRequests';

const AMOUNT = 20;
export async function checkMessages(req: Request, res: Response){
    try{
        const message =  await getManager()
        .getRepository(Messages)
        .createQueryBuilder("message")
        .where(`message.recipient = '${req['user'].id}'`)
        .andWhere('message.read = false')
        .getCount()

        res.status(201).json(message);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

export async function getUsersUnreadMessages(req: Request, res: Response){
    try{
        const unreadMessages = await getReadMessages(req['user'].id, false);
        const readMessages = await getReadMessages(req['user'].id, true);
        const final = readMessages.length > 0 ? unreadMessages.concat(readMessages) : unreadMessages
        return res.status(201).json(final);
      
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

export async function sendMessages(req: Request, res: Response){
    try{
        await createMessage(req.body,  req['user'].id).save();
        res.status(201).send();
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

export async function getMessages(req: Request, res: Response){
    try{
        const result = await getManager()
        .getRepository(Messages)
        .createQueryBuilder("message")
        .leftJoinAndSelect("message.sender", 'sender')
        .where(`message.recipient = '${req['user'].id}' AND message.sender = '${req.params.senderId}'`)
        .orWhere(`message.recipient = '${req.params.senderId}' AND message.sender = '${req['user'].id}'`)
        .orderBy('message.id','DESC')
        .limit(AMOUNT).offset(+req.params.offset)
        .getMany()

        const info = deeplyFilterUser(result, req['user'].username.toLocaleLowerCase());
        await Messages.update({ recipient: req['user'].id, read: false },{ read: true });
        res.status(201).json(info);
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
}

//------------------------------- Create functions -----------------------------------
function createMessage (body: Messages, senderId: string){
    const message = new Messages;
    message.read = false;
    message.recipient = body.recipient;
    message.sender = senderId;
    message.message = body.message;
    return message;
}

//------------------------------- Query functions -----------------------------------
async function getReadMessages(id: string, bool: Boolean){
    const subQ = getManager()
    .getRepository(Messages)
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.sender", "user")
    .where(`message.recipient = '${id}'`)
    .andWhere(`message.read = ${bool}`)
    .select("message.sender", "id").distinct(true)

    const result = await getManager()
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.messageSend", 'mes')
    .where("user.id IN (" + subQ.getQuery() + ")")
    .loadRelationCountAndMap('user.messages', 'user.messageSend',
        'messages', (qb) => qb.where('messages.read IS false'))
    .select('user.id')
    .addSelect('user.displayUsername')
    .addSelect('user.profileImage')
    .orderBy('mes.createdAt','DESC')
    .getMany()

    return result;
}