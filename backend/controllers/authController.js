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
        birthDate: user.birthDate,
        zodiac: user.zodiac,
        gender: user.gender,
        relationship: user.relationship,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id)
    });
});

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.birthDate = req.body.birthDate || user.birthDate;
        user.zodiac = req.body.zodiac || user.zodiac;
        user.gender = req.body.gender || user.gender;
        user.relationship = req.body.relationship || user.relationship;
        user.isProfileComplete = true; // Onboarding tamamlandıysa true'ya set et

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            birthDate: updatedUser.birthDate,
            zodiac: updatedUser.zodiac,
            gender: updatedUser.gender,
            relationship: updatedUser.relationship,
            isProfileComplete: updatedUser.isProfileComplete,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = { getUserProfile, googleLogin, updateProfile };
