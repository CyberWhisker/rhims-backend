// routes/user.js
const express = require('express');
const multer = require('multer')
const { getData, updateData, deleteData, storeData } = require('../controllers/ExperienceController');
const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../react-frontend/public/experienceImg/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage: storage })

// Get all users from Auth0

router.post('/', upload.single('file'), storeData);

router.patch('/:id', upload.single('file'), updateData);

router.delete('/:id', deleteData);

router.get('/', getData);

module.exports = router;
