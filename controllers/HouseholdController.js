const Model = require('../models/HouseholdModel')


const getData = async (req, res) => {
    try {
        const data = await Model.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const storeData = async (req, res) => {
    try {
        const data = await Model.create(req.body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const editData = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.findOneAndUpdate({ _id: id }, req.body, { new: true })
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message })
    }
};

const deleteData = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.findOneAndDelete(id)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

module.exports = {
    getData,
    storeData,
    editData,
    deleteData
}