const express = require('express');
const { getData, storeData, editData, deleteData } = require('../controllers/PeopleController');
const router = express.Router();

router.get('/', getData);
router.post('/', storeData);
router.patch('/:id', editData);
router.delete('/:id', deleteData);

module.exports = router;