const mongoose = require('mongoose');

const peopleSchema = new mongoose.Schema({
    householdId: {
        type: mongoose.Types.ObjectId,
        ref: 'Household',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    },
    civilStatus: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    demographics: {
        ethnicity: String,
        is4PsMember: Boolean,
        philHealth: {
            idNumber: String,
            membershipType: String,
            category: String
        }
    },
    health: {
        medicalHistory: String,
        lastMenstrualPeriod: Date,
        familyPlanning: {
            usingAnyMethod: Boolean,
            methodUsed: String,
            status: String
        },
        waterSourceType: String,
        toiletFacilityType: String,
        conditions: {
            asthma: Boolean,
            cancer: Boolean,
            pwde: Boolean,
            stroke: Boolean,
            mass: Boolean,
            mhgap: Boolean,
            smoker: Boolean,
            alcoholDrinker: Boolean
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('People', peopleSchema);