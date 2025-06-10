const mongoose = require('mongoose');

const householdSchema = new mongoose.Schema({
    householdNo: {
        type: String,
        required: true
    },
    householdName: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    barangay: {
        type: String,
        required: true
    },
    municipality: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Household', householdSchema);