const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    type: { 
        type: String, 
        required: true 
    }, // tarot, coffee, etc.
    result: { 
        type: Array, 
        required: true 
    }, // Store the fal interpretation array
    cards: { 
        type: Array, 
        required: true 
    }, // Selected cards
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true
    },
    deletedByUser: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Reading', readingSchema);
