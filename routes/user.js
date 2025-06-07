// routes/user.js
const express = require('express');
const multer = require('multer')
const upload = multer({ dest: '/tmp' });
const { getData, login, register, usingGoogle, updateData, deleteData, verifyEmail, requestResetPassword, confirmResetPassword } = require('../controllers/UserController');
const router = express.Router();

// Verify Email
router.get('/verify', verifyEmail);

router.get('/', getData);

router.post('/login', login);

router.post('/register', register);

router.post('/usingGoogle', usingGoogle);

// Recovery
router.post('/request-reset-password', requestResetPassword);

router.post('/confirm-reset-password', confirmResetPassword);


router.patch('/:id', upload.single('file'), updateData);

router.delete('/:id', deleteData);

module.exports = router;
