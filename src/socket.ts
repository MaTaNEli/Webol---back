import { Socket } from "socket.io";
import io from './app';

let users = [];

const addUser = (userId: string, socketId: string) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

const getUser = (userId: string) => {
    return users.find((user) => user.userId === userId);
};

export function socketConnection(socket: Socket){
    
    socket.on("connected", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users)
    });

    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage",async ({ senderId, receiverId, text }) => {
        const user = await getUser(receiverId);
        if(user){
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } 
    });
}