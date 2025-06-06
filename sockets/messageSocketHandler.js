module.exports = function handleMessageSocket(io) {
    const users = new Map();

    io.on('connection', (socket) => {
        socket.on('register_user', (userId) => {
            users.set(userId, socket.id);
        });

        console.log('A user connected:', users);

        socket.on('send_message', (messageData) => {
            const receiverSocketId = users.get(messageData.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('receive_message', messageData);
            }
        });

        socket.on('disconnect', () => {
            for (const [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                    users.delete(userId);
                    break;
                }
            }
        });
    });
};
