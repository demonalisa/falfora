const express = require('express');
const router = express.Router();
const { 
    createReading, 
    getReadings, 
    getReadingById, 
    deleteReading,
    clearReadings
} = require('../controllers/readingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createReading)
    .get(protect, getReadings)
    .delete(protect, clearReadings);

router.route('/:id')
    .get(protect, getReadingById)
    .delete(protect, deleteReading);

module.exports = router;
