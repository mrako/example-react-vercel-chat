"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
// Mock KV storage object
let roomsMessages = {};
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
        var _a;
        // Save message to KV storage
        (_a = roomsMessages[room]) === null || _a === void 0 ? void 0 : _a.push(message);
        // Broadcast message to the room
        io.to(room).emit('newMessage', message);
    });
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map