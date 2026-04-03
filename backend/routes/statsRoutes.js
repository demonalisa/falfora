const express = require('express');
const router = express.Router();
const { getUserStats, getGlobalStats } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/user', protect, getUserStats);
router.get('/global', getGlobalStats);

module.exports = router;
