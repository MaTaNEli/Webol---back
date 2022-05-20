const users = {};
const notifications = {};

export function addUser(userId: string, socketId: string) {
    users[userId] = socketId
    return users
};

export function removeUser(socketId: string){
    Object.keys(users).map((k) => {users[k] === socketId &&  delete users[k]})
    return users;
};

export function getUser(userId: string){
    return users[userId];
};

export function addNotification(userId: string) {
    notifications[userId]? notifications[userId] += 1 : notifications[userId] = 1;
    return notifications
};

export function removeNotification(userId: string){
    if(notifications[userId])
        delete notifications[userId];
    return notifications;
};