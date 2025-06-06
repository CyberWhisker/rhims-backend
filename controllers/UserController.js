const Model = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const { default: mongoose } = require('mongoose')
const sendPasswordResetEmail = require('../utils/sendPasswordRequestEmail')
const FileUpload = require('../utils/FileUploadUtil')

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const data = await Model.loginHash(email, password)
        res.status(200).json({ _id: data._id, email: data.email, role: data.role, picture: data.picture, verified: data.verified })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const register = async (req, res) => {
    try {
        const user = await Model.registerHash(req.body)
        await sendVerificationEmail(user.email, user._id)
        res.status(200).json({ _id: user._id, email: user.email, role: user.role, picture: user.picture, verified: user.verified })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateData = async (req, res) => {
    const { id } = req.params;
    const { password, ...rest } = req.body;
    let updateFields = rest;

    try {
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updateFields.password = hash;
        }

        if (req.file) {
            const savedFileId = await FileUpload.processAndSaveFile(req.file)
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const fileUrl = `${baseUrl}/file/${savedFileId}`;
            updateFields.picture = fileUrl
        }

        const user = await Model.findByIdAndUpdate(id, updateFields, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteData = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await Model.findByIdAndDelete({ _id: id });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const usingGoogle = async (req, res) => {
    const { email } = req.body;
    try {
        // Create user data with a default password
        const formData = {
            ...req.body,
            verified: true,  // This can be set to a default password or generated
            password: 'default',  // This can be set to a default password or generated
        };

        // Attempt to register a new user
        const user = await Model.registerHash(formData);

        // Return the newly registered user details
        res.status(200).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            picture: user.picture,
            verified: user.verified,
        });
    } catch (error) {
        if (error.message === 'Email already in use') {
            // If the email is already in use, find the existing user
            const user = await Model.findOne({ email: email });

            // Return the existing user's details
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture,
                verified: user.verified,
            });
        }

        // Handle other errors
        res.status(400).json({ error: error.message });
    }
};

// Get All Users
const getData = async (req, res) => {
    try {
        const data = await Model.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const verifyEmail = async (req, res) => {
    const { token, userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET);

        if (decoded.userId !== userId) {
            throw new Error('Invalid token or user ID.');
        }

        // Update user to verified
        const user = await Model.findByIdAndUpdate(userId, { verified: true }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Email successfully verified!', data: { _id: user._id, email: user.email, role: user.role, picture: user.picture, verified: user.verified } });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};

const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Model.findOne({ email });
        if (!user) throw new Error('Email not found.');

        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });
        await sendPasswordResetEmail(email, token);

        res.status(200).json({ message: 'Reset email sent.' });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }
};

const confirmResetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const user = await Model.findById(decoded.userId);

        if (!user) throw new Error('Invalid token.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getData,
    login,
    register,
    usingGoogle,
    updateData,
    deleteData,

    verifyEmail,
    requestResetPassword,
    confirmResetPassword,
};
