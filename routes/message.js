const express = require('express');
const multer = require('multer');

const {
    storeData,
    getDataByConversationId,
    storeFileData,
    getMessagesUnread,
    markMessagesAsReadByConversation,
} = require('../controllers/MessageController');

const router = express.Router();
const upload = multer({ dest: 'tmp/' });
// Route to get Data
router.get('/convoId/:id', getDataByConversationId);

router.get('/unread/:id', getMessagesUnread);

router.patch('/markMessagesAsReadByConversation/:userId/:conversationId', markMessagesAsReadByConversation);

// Route to get Data
router.post('/', upload.single('file'), storeData);

// Route to get Data
router.post('/upload', upload.single('file'), storeFileData);

module.exports = router;
