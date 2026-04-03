const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    sub: {
        type: String,
        unique: true,
        sparse: true // Bu sayede sadece Google ile girenlere sub atanır
    },
    // No password field as we only use Google login
    // Onboarding & Profile Info
    birthDate: { type: String }, // 'YYYY-MM-DD' veya 'Date' string
    zodiac: { type: String },
    gender: { type: String },
    relationship: { type: String },
    isProfileComplete: { type: Boolean, default: false },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Removed password hashing middleware as password is gone

module.exports = mongoose.model('User', userSchema);
