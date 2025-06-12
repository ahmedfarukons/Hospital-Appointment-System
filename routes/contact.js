const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// İletişim Şeması
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['yeni', 'okundu', 'yanıtlandı'], default: 'yeni' },
    createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Tüm iletişim mesajlarını getir (sadece admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Mesajlar getirilirken bir hata oluştu' });
    }
});

// Tek bir iletişim mesajını getir
router.get('/:id', async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Mesaj bulunamadı' });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Mesaj getirilirken bir hata oluştu' });
    }
});

// Yeni iletişim mesajı gönder
router.post('/', async (req, res) => {
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    });

    try {
        const newContact = await contact.save();
        res.status(201).json({
            message: 'Mesajınız başarıyla gönderildi',
            contact: newContact
        });
    } catch (error) {
        res.status(400).json({ message: 'Mesaj gönderilirken bir hata oluştu' });
    }
});

// Mesaj durumunu güncelle
router.put('/:id', async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Mesaj bulunamadı' });
        }

        if (req.body.status) {
            message.status = req.body.status;
        }

        const updatedMessage = await message.save();
        res.json({
            message: 'Mesaj durumu başarıyla güncellendi',
            contact: updatedMessage
        });
    } catch (error) {
        res.status(400).json({ message: 'Mesaj güncellenirken bir hata oluştu' });
    }
});

// İletişim mesajını sil
router.delete('/:id', async (req, res) => {
    try {
        const message = await Contact.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Mesaj bulunamadı' });
        }

        await message.deleteOne();
        res.json({ message: 'Mesaj başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Mesaj silinirken bir hata oluştu' });
    }
});

module.exports = router;
