const Model = require('../models/ConversationModel');

//Get Single Data
const getConversationById = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.findOne({ _id: id })
            .populate('participants', '-password')
            .populate('lastMessage');
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

const getConversationByUserId = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.find({ participants: id })
            .populate('participants', '-password')
            .populate('lastMessage');
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

const storeData = async (req, res) => {
    try {
        const incomingParticipants = req.body.participants;
        // Validate input
        if (!Array.isArray(incomingParticipants) || incomingParticipants.length !== 2) {
            return res.status(400).json({ error: 'Exactly two participants are required.' });
        }

        // Sort participant IDs to ensure consistent order
        const sortedIncoming = [...incomingParticipants].sort();
        // Check if conversation with these exact participants already exists
        const existing = await Model.findOne({
            participants: { $all: sortedIncoming, $size: 2 }
        })
            .populate('participants', '-password')
            .populate('lastMessage');

        if (existing) {
            return res.status(200).json(existing);
        }

        // Create new conversation
        const created = await Model.create({ participants: sortedIncoming });

        // Populate related fields
        const data = await Model.findById(created._id)
            .populate('participants', '-password')
            .populate('lastMessage');
        res.status(200).json(data);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

const deleteData = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.findOneAndDelete({ _id: id })
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }

}

module.exports = {
    getConversationByUserId,
    storeData,
    deleteData,
    getConversationById
};
