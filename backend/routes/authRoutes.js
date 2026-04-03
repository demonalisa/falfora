const express = require('express');
const router = express.Router();
const { getUserProfile, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);

module.exports = router;
