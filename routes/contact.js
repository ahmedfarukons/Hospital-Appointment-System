const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log('Yeni iletişim mesajı:');
    console.log('Ad Soyad:', name);
    console.log('E-posta:', email);
    console.log('Konu:', subject);
    console.log('Mesaj:', message);
    res.status(200).json({ message: 'Mesaj alındı!' });
});

module.exports = router;
