require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');

const { setupSocket } = require('./sockets'); // 👈 Import your socket setup

// Constants
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

// Create Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors(
    {
        origin: '*', methods: ['GET', 'POST', 'DELETE', 'PATCH']

    }
));
app.use(express.json());

// API Routes
app.use('/user', require('./routes/user'));
app.use('/techStack', require('./routes/techStack'));
app.use('/project', require('./routes/project'));
app.use('/experience', require('./routes/experience'));
app.use('/file', require('./routes/file'));
app.use('/conversation', require('./routes/conversation'));
app.use('/message', require('./routes/message'));

// Socket.IO setup
setupSocket(server); // 👈 Initialize socket(s)

// Connect to MongoDB and start the server
mongoose.connect(mongoUri)
    .then(() => {
        server.listen(port, () => {
            console.log(`✅ Connected to DB & Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
    });
