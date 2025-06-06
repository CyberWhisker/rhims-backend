const fs = require('fs');
// Import your file model - adjust the path as needed
const File = require('../models/FileModel');

/**
 * Process an uploaded file, convert it to base64, and save to MongoDB
 * @param {Object} file - The file object from multer middleware
 * @returns {Object} - Saved MongoDB document
 */
exports.processAndSaveFile = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // Read file from disk
    const filePath = file.path;
    const fileData = fs.readFileSync(filePath);

    // Convert to base64
    const base64Data = fileData.toString('base64');

    // Create new File document
    const newFile = new File({
      filename: file.originalname,
      contentType: file.mimetype,
      data: base64Data,
      fileSize: file.size
    });

    // Save to MongoDB
    const savedFile = await newFile.save();
    const fileId = savedFile.id
    // Clean up temp file
    fs.unlinkSync(filePath);

    // Return savedFile.id document (without the large base64 data for cleaner response)
    const returnFile = savedFile.toObject();
    delete returnFile.data; // Remove large base64 data from response

    return fileId;
  } catch (error) {
    console.error('Error processing and saving file:', error);
    throw new Error(`Failed to process and save file: ${error.message}`);
  }
};

/**
 * Process multiple uploaded files, convert them to base64, and save to MongoDB
 * @param {Array} files - Array of file objects from multer middleware
 * @returns {Array} - Array of saved MongoDB documents
 */
exports.processAndSaveFiles = async (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  console.log(`Processing ${files.length} files`);

  try {
    const savedFiles = [];

    for (const file of files) {
      const savedFile = await exports.processAndSaveFile(file);
      savedFiles.push(savedFile);
    }

    return savedFiles;
  } catch (error) {
    console.error('Error processing and saving files:', error);
    throw new Error(`Failed to process and save files: ${error.message}`);
  }
};

/**
 * Process an uploaded file and convert to base64 (without saving to MongoDB)
 * @param {Object} file - The file object from multer middleware
 * @returns {Object} - Object containing file metadata and base64 content
 */
exports.processUploadedFile = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  try {
    // Read file from disk
    const filePath = file.path;
    const fileData = fs.readFileSync(filePath);

    // Convert to base64
    const base64Data = fileData.toString('base64');

    // Create file metadata object
    const fileObject = {
      filename: file.originalname,
      contentType: file.mimetype,
      data: base64Data,
      fileSize: file.size
    };

    // Clean up temp file
    fs.unlinkSync(filePath);

    return fileObject;
  } catch (error) {
    console.error('Error processing file:', error);
    throw new Error(`Failed to process file: ${error.message}`);
  }
};

/**
 * Process multiple uploaded files and convert to base64 (without saving to MongoDB)
 * @param {Array} files - Array of file objects from multer middleware
 * @returns {Array} - Array of objects containing file metadata and base64 content
 */
exports.processUploadedFiles = async (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    return [];
  }

  try {
    const processedFiles = [];

    for (const file of files) {
      const processedFile = await exports.processUploadedFile(file);
      processedFiles.push(processedFile);
    }

    return processedFiles;
  } catch (error) {
    console.error('Error processing files:', error);
    throw new Error(`Failed to process files: ${error.message}`);
  }
};