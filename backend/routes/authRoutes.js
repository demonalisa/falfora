const express = require('express');
const router = express.Router();
const { getUserProfile, googleLogin, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
