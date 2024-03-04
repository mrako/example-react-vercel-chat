import express from 'express';
import { Server } from "socket.io";
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Mock KV storage object
let roomsMessages: { [key: string]: string[] } = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    // Initialize room in KV if not exist
    if (!roomsMessages[room]) {
      roomsMessages[room] = [];
    }
    // Send existing messages to the newly joined user
    socket.emit('previousMessages', roomsMessages[room]);
  });

  socket.on('chatMessage', ({ room, message }) => {
    // Save message to KV storage
    roomsMessages[room]?.push(message);
    // Broadcast message to the room
    io.to(room).emit('newMessage', message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
