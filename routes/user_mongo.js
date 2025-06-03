const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kullanıcı Şeması
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String },
    phone: { type: String },
    role: { type: String, enum: ['hasta', 'admin'], default: 'hasta' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Tüm kullanıcıları getir (sadece admin)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcılar getirilirken bir hata oluştu' });
    }
});

// Tek bir kullanıcıyı getir
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı getirilirken bir hata oluştu' });
    }
});

// Yeni kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        // Kullanıcı zaten var mı kontrol et
        const existingUser = await User.findOne({ 
            $or: [
                { email: req.body.email.toLowerCase() },
                { username: req.body.username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor' });
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            fullName: req.body.fullName,
            phone: req.body.phone,
            role: req.body.role || 'hasta'
        });

        const newUser = await user.save();
        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.fullName,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Kullanıcı oluşturulurken bir hata oluştu' });
    }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul (küçük harfe çevirerek)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        // JWT oluştur
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            'gizli_jwt_anahtari', // Gerçek projede .env dosyasına koy!
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Giriş başarılı',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            },
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Giriş yapılırken bir hata oluştu' });
    }
});

// Kullanıcı bilgilerini güncelle
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Şifre güncelleniyorsa hashle
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        Object.assign(user, req.body);
        const updatedUser = await user.save();
        
        res.json({
            message: 'Kullanıcı başarıyla güncellendi',
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                role: updatedUser.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Kullanıcı güncellenirken bir hata oluştu' });
    }
});

// Kullanıcı sil
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        await user.deleteOne();
        res.json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Kullanıcı silinirken bir hata oluştu' });
    }
});

module.exports = router;