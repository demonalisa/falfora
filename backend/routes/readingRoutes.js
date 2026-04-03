const express = require('express');
const router = express.Router();
const { 
    createReading, 
    getReadings, 
    getReadingById, 
    deleteReading 
} = require('../controllers/readingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReading)
    .get(protect, getReadings);

router.route('/:id')
    .get(protect, getReadingById)
    .delete(protect, deleteReading);

module.exports = router;
