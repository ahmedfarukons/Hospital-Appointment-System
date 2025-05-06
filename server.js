const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');

const app = express();

// MongoDB bağlantısı (buradaki bağlantı adresini kendi veritabanı adresinle değiştir)

mongoose.connect('mongodb+srv://mmelihcaglayik:m3l1hc4gl4y1k@cluster0.wrtjzv6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
  })
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments-mongo', require('./routes/appointments_mongo'));
app.use('/api/users-mongo', require('./routes/user_mongo'));
app.use('/api/contact', require('./routes/contact')); // <-- İLETİŞİM ROUTE'U EKLENDİ

// Ana endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Bir hata oluştu',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
