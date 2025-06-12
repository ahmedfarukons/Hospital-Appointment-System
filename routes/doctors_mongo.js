const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Doktor Şeması
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    education: { type: String, required: true },
    image: { type: String },
    availableHours: [{
        day: String,
        startTime: String,
        endTime: String
    }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);

// Tüm doktorları getir
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Doktorlar getirilirken bir hata oluştu' });
    }
});

// Tek bir doktoru getir
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doktor bulunamadı' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Doktor getirilirken bir hata oluştu' });
    }
});

// Yeni doktor ekle
router.post('/', async (req, res) => {
    const doctor = new Doctor({
        name: req.body.name,
        specialization: req.body.specialization,
        experience: req.body.experience,
        education: req.body.education,
        image: req.body.image,
        availableHours: req.body.availableHours
    });

    try {
        const newDoctor = await doctor.save();
        res.status(201).json(newDoctor);
    } catch (error) {
        res.status(400).json({ message: 'Doktor eklenirken bir hata oluştu' });
    }
});

// Doktor bilgilerini güncelle
router.put('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doktor bulunamadı' });
        }

        Object.assign(doctor, req.body);
        const updatedDoctor = await doctor.save();
        res.json(updatedDoctor);
    } catch (error) {
        res.status(400).json({ message: 'Doktor güncellenirken bir hata oluştu' });
    }
});

// Doktor sil
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doktor bulunamadı' });
        }

        await doctor.deleteOne();
        res.json({ message: 'Doktor başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Doktor silinirken bir hata oluştu' });
    }
});

module.exports = router;
