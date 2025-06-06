const { Server } = require('socket.io');
const handleMessageSocket = require('./messageSocketHandler');
// const handleMailSocket = require('./mailSocketHandler'); (future)
// const handleCommentSocket = require('./commentSocketHandler'); (future)

function setupSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    // Initialize each socket feature
    handleMessageSocket(io);
    // handleMailSocket(io);
    // handleCommentSocket(io);
}

module.exports = { setupSocket };
