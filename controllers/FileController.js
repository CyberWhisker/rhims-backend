const File = require('../models/FileModel');
const FileUpload = require('../utils/FileUploadUtil')

// Upload and save as base64 to MongoDB
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file received in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const savedFile = FileUpload.processAndSaveFile(req.file)
        res.status(201).json({
            message: 'File uploaded successfully',
        });
    } catch (error) {
        console.error('Error in uploadFile:', error);
        res.status(500).json({ error: 'File upload failed', details: error.message });
    }
};

// Get and return file by ID
exports.getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            console.log('File not found with ID:', req.params.id);
            return res.status(404).json({ error: 'File not found' });
        }

        const buffer = Buffer.from(file.data, 'base64');
        res.set('Content-Type', file.contentType);
        res.send(buffer);
    } catch (error) {
        console.error('Error in getFile:', error);
        res.status(500).json({ error: 'Could not retrieve file', details: error.message });
    }
};

// Get all files (returns metadata only, not binary data)
exports.getAllFile = async (req, res) => {
    try {
        // This returns all files but excludes the large binary data field
        const files = await File.find({}, { data: 0 });

        res.status(200).json({
            count: files.length,
            files: files.map(file => ({
                id: file._id,
                filename: file.filename,
                contentType: file.contentType,
                createdAt: file.createdAt
            }))
        });
    } catch (error) {
        console.error('Error in getAllFile:', error);
        res.status(500).json({ error: 'Could not retrieve files', details: error.message });
    }
};