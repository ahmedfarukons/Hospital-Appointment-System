const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Appointment Model
const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },
    complaint: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Appointment = mongoose.model('AppointmentMongo', appointmentSchema);

// Tüm randevuları getir
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctorId');
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ 
            error: 'Randevular getirilirken bir hata oluştu',
            details: err.message
        });
    }
});

// Tek bir randevuyu getir
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('doctorId');
        if (!appointment) {
            return res.status(404).json({ error: 'Randevu bulunamadı' });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ 
            error: 'Randevu getirilirken bir hata oluştu',
            details: err.message
        });
    }
});

// Yeni randevu ekle
router.post('/', async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        const savedAppointment = await newAppointment.save();
        res.status(201).json(savedAppointment);
    } catch (err) {
        res.status(500).json({ 
            error: 'Randevu eklenirken bir hata oluştu',
            details: err.message
        });
    }
});

// Randevu güncelle
router.put('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ error: 'Randevu bulunamadı' });
        }
        res.json(appointment);
    } catch (err) {
        res.status(500).json({ 
            error: 'Randevu güncellenirken bir hata oluştu',
            details: err.message
        });
    }
});

// Randevu sil
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ error: 'Randevu bulunamadı' });
        }
        res.json({ message: 'Randevu başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ 
            error: 'Randevu silinirken bir hata oluştu',
            details: err.message
        });
    }
});

module.exports = router;