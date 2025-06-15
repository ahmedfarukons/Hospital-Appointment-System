const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'gizli_jwt_anahtari';

// Kullanıcı Şeması
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
        console.error('Get users error:', error);
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
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Kullanıcı getirilirken bir hata oluştu' });
    }
});

// Yeni kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        console.log('Register request body:', req.body);

        // Gerekli alanları kontrol et
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Tüm gerekli alanları doldurun' });
        }

        // E-posta formatını kontrol et
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ message: 'Geçersiz e-posta formatı' });
        }

        // Kullanıcı zaten var mı kontrol et
        const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
        }

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Yeni kullanıcı oluştur
        const user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            phone: req.body.phone
        });

        const newUser = await user.save();
        console.log('New user created:', newUser);

        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone || ''
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ 
            message: 'Kullanıcı oluşturulurken bir hata oluştu',
            error: error.message 
        });
    }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    try {
        console.log('Login request body:', req.body);

        const { email, password } = req.body;

        // Gerekli alanları kontrol et
        if (!email || !password) {
            return res.status(400).json({ message: 'E-posta ve şifre gereklidir' });
        }

        // Kullanıcıyı bul
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
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful for user:', user.email);

        res.json({
            message: 'Giriş başarılı',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || ''
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Giriş yapılırken bir hata oluştu',
            error: error.message 
        });
    }
});

// Kullanıcı bilgilerini getir
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.json(user);
    } catch (error) {
        console.error('Profile error:', error);
        res.status(401).json({ message: 'Geçersiz token' });
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
                name: updatedUser.name,
                email: updatedUser.email
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
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
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Kullanıcı silinirken bir hata oluştu' });
    }
});

module.exports = router;