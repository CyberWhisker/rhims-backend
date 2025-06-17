const Model = require('../models/PeopleModel')


const getData = async (req, res) => {
    try {
        const data = await Model.find().populate('householdId')
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const getDataById = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.findById(id)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
};

const getDataByHouseholdId = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.find({ householdId: id }).populate('householdId')
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

const storeMultipleData = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Expected an array of data' });
        }
        const data = await Model.insertMany(req.body);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
    deleteData,
    storeMultipleData,
    getDataById,
    getDataByHouseholdId
}