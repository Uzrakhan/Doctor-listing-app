const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    consultationFee: Number,
    availability: { type: Boolean, default: true },
    consultationType: { type: String, enum: ['online', 'in-person'] }
});

module.exports = mongoose.model('Doctor', DoctorSchema)