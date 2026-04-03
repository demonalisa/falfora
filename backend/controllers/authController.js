const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const googleLogin = asyncHandler(async (req, res) => {
    const { email, username, sub } = req.body; 

    if (!email) {
        res.status(400);
        throw new Error('Google identity email is required');
    }

    // 1. Email veya Sub bazlı kullanıcıyı ara
    let user = await User.findOne({ $or: [{ email }, { sub }] });

    if (!user) {
        // Kullanıcı yoksa oluştur
        user = await User.create({
            username: username || email.split('@')[0],
            email,
            sub
        });
    } else {
        // Kullanıcı varsa ama 'sub' alanı eksikse güncelle 
        if (!user.sub && sub) {
            user.sub = sub;
            await user.save();
        }
    }

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        sub: user.sub,
        token: generateToken(user._id)
    });
});

module.exports = { getUserProfile, googleLogin };
