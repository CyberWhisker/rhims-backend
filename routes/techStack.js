// routes/user.js
const express = require('express');
const multer = require('multer')
const upload = multer({ dest: '/tmp' });
const { getData, updateData, deleteData, storeData } = require('../controllers/TechStackController');
const router = express.Router();

// Get all users from Auth0

router.post('/', upload.single('file'), storeData);

router.patch('/:id', upload.single('file'), updateData);

router.delete('/:id', deleteData);

router.get('/', getData);

module.exports = router;
