// routes/user.js
const express = require('express');
const multer = require('multer')
const upload = multer({ dest: '/tmp' });
const { getData, login, register, usingGoogle, updateData, deleteData, verifyEmail, requestResetPassword, confirmResetPassword } = require('../controllers/UserController');
const router = express.Router();

// Get all users from Auth0
router.get('/', getData);

router.patch('/:id', upload.single('file'), updateData);

router.delete('/:id', deleteData);

router.post('/login', login);

router.post('/register', register);

router.post('/usingGoogle', usingGoogle);


// Verify Email
router.get('/verify', verifyEmail);

// Recovery
router.post('/requestResetPassword', requestResetPassword);

router.post('/confirm-reset-password', confirmResetPassword);

module.exports = router;
