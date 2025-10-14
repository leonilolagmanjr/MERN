const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            // Keep your origins
            origin: ['http://100.123.122.74:3000'],
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        //console.log('A user connected:', socket.id);

        // This remains necessary: clients join a room specific to the chat ID
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        });

        // Add a leave chat event for better room management
        socket.on('leaveChat', (chatId) => {
            socket.leave(chatId);
            console.log(`User left chat: ${chatId}`);
        });

        // CRITICAL: The 'sendMessage' listener is REMOVED.
        // Broadcasting is now handled reliably by the chatService after DB save.

        socket.on('disconnect', () => {
            //console.log('A user disconnected:', socket.id);
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIO };