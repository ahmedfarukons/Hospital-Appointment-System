const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    availableSlots: [{
        date: Date,
        time: String,
        isBooked: {
            type: Boolean,
            default: false
        }
    }]
});

module.exports = mongoose.model('Doctor', doctorSchema); 