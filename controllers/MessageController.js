const Model = require('../models/MessageModel');
const FileUpload = require('../utils/FileUploadUtil')
const mongoose = require('mongoose')

//Get Single Data
const getDataByConversationId = async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: 'Not valid ID' })
        }
        const data = await Model.find({ conversationId: id })
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

}

const storeData = async (req, res) => {
    const newData = { ...req.body };
    try {
        if (req?.file) {
            const savedFileId = await FileUpload.processAndSaveFile(req.file);
            newData.fileId = savedFileId;
        }

        const createdData = await Model.create(newData);

        return res.status(201).json(createdData);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

const storeFileData = async (req, res) => {
    try {
        const savedFileId = await FileUpload.processAndSaveFile(req.file)
        const data = await Model.create({ ...req.body, fileId: savedFileId });
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}

const getMessagesUnread = async (req, res) => {
    const { id } = req.params
    try {
        const data = await Model.aggregate([
            {
                $match: {
                    readBy: { $nin: [new mongoose.Types.ObjectId(id)] }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$conversationId",
                    latestUnreadMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: 'conversations',
                    localField: '_id', // this was the bug
                    foreignField: '_id',
                    as: 'conversation'
                }
            },
            { $unwind: '$conversation' },
            {
                $match: {
                    'conversation.participants': new mongoose.Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'latestUnreadMessage.sender',
                    foreignField: '_id',
                    as: 'senderDetails'
                }
            },
            { $unwind: '$senderDetails' },
            {
                $project: {
                    latestUnreadMessage: 1,
                    senderDetails: 1
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
}


const markMessagesAsReadByConversation = async (req, res) => {
    try {
        const { userId, conversationId } = req.params;
        const result = await Model.updateMany(
            {
                conversationId: new mongoose.Types.ObjectId(conversationId),
                readBy: { $nin: [new mongoose.Types.ObjectId(userId)] }
            },
            {
                $addToSet: { readBy: new mongoose.Types.ObjectId(userId) }
            }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} messages marked as read in conversation ${conversationId}.`
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to mark messages as read",
            error: error.message,
        });
    }
};

module.exports = {
    getDataByConversationId,
    storeData,
    storeFileData,
    getMessagesUnread,
    markMessagesAsReadByConversation
};
