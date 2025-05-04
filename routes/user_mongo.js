const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user_mongo');

// Kayıt (Register)
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kullanıcı zaten var mı kontrol et
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor.' });
        }

        // Şifreyi hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // Yeni kullanıcı oluştur
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
    } catch (err) {
        res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu.', details: err.message });
    }
});

// Giriş (Login)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Geçersiz e-posta veya şifre.' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Geçersiz e-posta veya şifre.' });
        }

        // JWT oluştur
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            'gizli_jwt_anahtari', // Gerçek projede .env dosyasına koy!
            { expiresIn: '1h' }
        );

        res.json({ message: 'Giriş başarılı.', token });
    } catch (err) {
        res.status(500).json({ error: 'Giriş sırasında bir hata oluştu.', details: err.message });
    }
});

module.exports = router;