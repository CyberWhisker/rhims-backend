const express = require('express');

const {
    getConversationByUserId,
    storeData,
    deleteData,
    getConversationById,
} = require('../controllers/ConversationController');

const router = express.Router();

// Route to get Data
router.get('/:id', getConversationById);

// Route to get Data
router.get('/user/:id', getConversationByUserId);

// Route to get Data
router.post('/', storeData);

// Route to get Data
router.delete('/:id', deleteData);

module.exports = router;
