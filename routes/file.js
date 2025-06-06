const express = require('express');
const multer = require('multer')
const upload = multer({ dest: '/tmp' });
const { uploadFile, getFile, getAllFile } = require('../controllers/FileController');
const router = express.Router();

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/:id', getFile);
router.get('/', getAllFile);

module.exports = router;