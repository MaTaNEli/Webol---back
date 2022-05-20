import dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import app from './server';
import { initStorage } from './storage';
import {socketConnection} from './socket/socket';

const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: {origin: '*'}});

io.on("connection", socketConnection);

// Server listen on http//localhost:3000
(async () => {
    await initStorage();
    http.listen(process.env.PORT || 3000, () => console.log('Server is running'));
})();

export default io;