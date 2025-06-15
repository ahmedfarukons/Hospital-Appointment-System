const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Randevu Şeması
const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    complaint: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema, 'randevu');

// Tüm randevuları getir
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctorId');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Randevular getirilirken bir hata oluştu' });
    }
});

// Tek bir randevuyu getir
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate('doctorId');
        if (!appointment) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Randevu getirilirken bir hata oluştu' });
    }
});

// Kullanıcının randevularını e-postaya göre getir
router.get('/user/:email', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientEmail: req.params.email }).populate('doctorId');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcının randevuları getirilirken bir hata oluştu' });
    }
});

// Yeni randevu oluştur
router.post('/', async (req, res) => {
    try {
        // Aynı doktor, tarih ve saat için randevu kontrolü
        const existingAppointment = await Appointment.findOne({
            doctorId: req.body.doctorId,
            date: req.body.date,
            time: req.body.time,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(409).json({ 
                error: 'Bu doktor için seçilen gün ve saatte zaten bir randevu var' 
            });
        }

        const appointment = new Appointment({
            patientName: req.body.patientName,
            patientEmail: req.body.patientEmail,
            patientPhone: req.body.patientPhone,
            doctorId: req.body.doctorId,
            date: req.body.date,
            time: req.body.time,
            complaint: req.body.complaint
        });

        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Randevu oluşturma hatası:', error);
        res.status(400).json({ 
            message: 'Randevu oluşturulurken bir hata oluştu',
            error: error.message 
        });
    }
});

// Randevu durumunu güncelle
router.patch('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        appointment.status = req.body.status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (error) {
        res.status(400).json({ message: 'Randevu güncellenirken bir hata oluştu' });
    }
});

// Randevu sil
router.delete('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        await appointment.deleteOne();
        res.json({ message: 'Randevu başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Randevu silinirken bir hata oluştu' });
    }
});

module.exports = router;
