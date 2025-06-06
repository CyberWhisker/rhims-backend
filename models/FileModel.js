const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  data: {
    type: String, // Stores base64 encoded file data
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);