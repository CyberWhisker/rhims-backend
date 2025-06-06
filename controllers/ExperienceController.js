const Model = require('../models/ExperienceModel')
const FileUpload = require('../utils/FileUploadUtil')

const storeData = async (req, res) => {
    const { ...rest } = req.body
    let newData = rest;
    try {
        if (req.file) {
            const savedFileId = await FileUpload.processAndSaveFile(req.file)
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const fileUrl = `${baseUrl}/file/${savedFileId}`;
            newData.image = fileUrl
        }
        const data = await Model.create(newData)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
}

const updateData = async (req, res) => {
    const { id } = req.params
    const { ...rest } = req.body
    let newData = rest;
    try {
        if (req.file) {
            const savedFileId = await FileUpload.processAndSaveFile(req.file)
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const fileUrl = `${baseUrl}/file/${savedFileId}`;
            newData.image = fileUrl
        }
        const data = await Model.findByIdAndUpdate(id, newData)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
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

// Get All Users
const getData = async (req, res) => {
    try {
        const data = await Model.find().sort({ startDate: -1 })
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

module.exports = {
    storeData,
    updateData,
    deleteData,
    getData,
};
