const express = require('express');
const { getData, storeData, editData, deleteData, storeMultipleData, getDataById, getDataByHouseholdId } = require('../controllers/PeopleController');
const router = express.Router();

router.get('/', getData);
router.get('/:id', getDataById);
router.get('/household/:id', getDataByHouseholdId);
router.post('/storeMultipleData', storeMultipleData);
router.post('/', storeData);
router.patch('/:id', editData);
router.delete('/:id', deleteData);

module.exports = router;