const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb+srv://admin:administrator@cluster0.rlvb28v.mongodb.net/hospital?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB bağlantısı başarılı');
})
.catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
});

// API rotaları
app.use('/api/doctors', require('./routes/doctors_mongo'));
app.use('/api/appointments-mongo', require('./routes/appointments_mongo'));
app.use('/api/users-mongo', require('./routes/user_mongo'));

// Ana endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Hata ayıklama için middleware
app.use((err, req, res, next) => {
    console.error('Hata:', err);
    res.status(500).json({
        message: 'Sunucu hatası',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});