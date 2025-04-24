const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Doctor Model
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    phone: String,
    email: String,
    createdAt: { type: Date, default: Date.now }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Tüm doktorları getir
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: 'Doktorlar getirilirken bir hata oluştu' });
    }
});

// Tek bir doktoru getir
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doktor bulunamadı' });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: 'Doktor getirilirken bir hata oluştu' });
    }
});

// Yeni doktor ekle
router.post('/', async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (err) {
        res.status(500).json({ error: 'Doktor eklenirken bir hata oluştu' });
    }
});

// Doktor bilgilerini güncelle
router.put('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!doctor) {
            return res.status(404).json({ error: 'Doktor bulunamadı' });
        }
        res.json(doctor);
    } catch (err) {
        res.status(500).json({ error: 'Doktor güncellenirken bir hata oluştu' });
    }
});

// Doktor sil
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doktor bulunamadı' });
        }
        res.json({ message: 'Doktor başarıyla silindi' });
    } catch (err) {
        res.status(500).json({ error: 'Doktor silinirken bir hata oluştu' });
    }
});

module.exports = router;
