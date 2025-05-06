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

// Alınan saatleri döndür (yeni endpoint)
router.get('/booked-times', async (req, res) => {
    const { doctorId, appointmentDate } = req.query;
    if (!doctorId || !appointmentDate) {
        return res.status(400).json({ error: "Eksik parametre" });
    }
    const dateOnly = new Date(appointmentDate);
    dateOnly.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
        doctorId,
        appointmentDate: dateOnly
    });

    // Sadece saatleri döndür
    const times = appointments.map(a => a.appointmentTime);
    res.json(times);
});

// Yeni randevu ekle (KESİN ÇAKIŞMA KONTROLÜ)
router.post('/', async (req, res) => {
    console.log("Gelen randevu isteği:", req.body); // <-- EKLE
    try {
        const { doctorId, appointmentDate, appointmentTime } = req.body;

        // Tarihi sadece yıl-ay-gün olarak normalize et
        const dateOnly = new Date(appointmentDate);
        dateOnly.setHours(0, 0, 0, 0);

        // Aynı doktor, aynı gün ve aynı saatte randevu var mı kontrol et
        const existing = await Appointment.findOne({
            doctorId,
            appointmentDate: dateOnly,
            appointmentTime
        });

        if (existing) {
            return res.status(400).json({ 
                error: "Bu doktor için seçilen gün ve saatte zaten bir randevu var." 
            });
        }

        // Yeni randevuyu oluştururken de tarihi normalize et
        const newAppointment = new Appointment({
            ...req.body,
            appointmentDate: dateOnly
        });
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
