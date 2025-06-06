const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })


module.exports = mongoose.model('Project', ProjectSchema)