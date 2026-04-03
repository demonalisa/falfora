const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        required: true,
        index: true
    },
    type: { 
        type: String, 
        required: true 
    }, // tarot, coffee, etc.
    count: { 
        type: Number, 
        default: 0 
    }
});

// Compound index for date and type for fast searching/updating
statsSchema.index({ date: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Stats', statsSchema);
