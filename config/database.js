const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = "mongodb+srv://mmelihcaglayik:m3l1hc4gl4y1k@cluster0.wrtjzv6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas bağlantısı başarılı');
    } catch (err) {
        console.error('MongoDB bağlantı hatası:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
