import * as util from './utilities'
import { Socket } from "socket.io";
import io from '../app';

export function socketConnection(socket: Socket){
    socket.on("connected", (userId) => {
        const users = util.addUser(userId, socket.id);
        io.emit("getUsers", users)
    });

    socket.on("disconnect", () => {
        const users = util.removeUser(socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage",async ({ senderId, receiverId, text}) => {
        const userSocket = await util.getUser(receiverId);
        if(userSocket)
            io.to(userSocket).emit("getMessage", {
                senderId,
                text,
            }); 
    });

    socket.on("sendNotification",async (receiverId)=> {
        const userData = util.addNotification(receiverId);
        const userSocket = await util.getUser(receiverId);
        if(userSocket)
            io.in(userSocket).emit("getNotification", userData[receiverId]);
    });

    socket.on("eraseNotification",async (Id)=> {
        const userData = util.removeNotification(Id);
    });
}

