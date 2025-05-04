const router = require('express').Router();
const { pool } = require('../config/database');

// Tüm randevuları getir
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments ORDER BY appointment_date, appointment_time');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Yeni randevu oluştur
router.post('/', async (req, res) => {
    try {
        const {
            tc_no,
            name,
            email,
            phone,
            doctor_id,
            appointment_date,
            appointment_time,
            complaint
        } = req.body;

        // Önce hasta kaydı yap veya mevcut hastayı bul
        let patient = await pool.query('SELECT * FROM patients WHERE tc_no = $1', [tc_no]);
        
        if (patient.rows.length === 0) {
            patient = await pool.query(
                'INSERT INTO patients (tc_no, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
                [tc_no, name, email, phone]
            );
        }

        // Randevu oluştur
        const appointment = await pool.query(
            `INSERT INTO appointments 
            (patient_id, doctor_id, appointment_date, appointment_time, complaint) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [patient.rows[0].id, doctor_id, appointment_date, appointment_time, complaint]
        );

        res.status(201).json({
            success: true,
            message: 'Randevu başarıyla oluşturuldu',
            appointment: appointment.rows[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Randevu iptal et
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
        res.json({ message: 'Randevu başarıyla iptal edildi' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TC kimlik no ile randevuları sorgula
router.get('/check/:tcno', async (req, res) => {
    try {
        const { tcno } = req.params;
        const result = await pool.query(
            `SELECT a.*, d.name as doctor_name 
             FROM appointments a
             JOIN patients p ON a.patient_id = p.id
             JOIN doctors d ON a.doctor_id = d.id
             WHERE p.tc_no = $1
             ORDER BY a.appointment_date, a.appointment_time`,
            [tcno]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;