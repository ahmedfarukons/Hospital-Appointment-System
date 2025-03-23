// Doktor filtreleme fonksiyonu
function doktorlariFiltrele() {
    const seciliBolum = document.getElementById('bolum').value;
    const doktorKartlari = document.querySelectorAll('.doktor-kart');

    doktorKartlari.forEach(kart => {
        if (seciliBolum === 'tumbolumler' || kart.dataset.bolum === seciliBolum) {
            kart.style.display = 'block';
        } else {
            kart.style.display = 'none';
        }
    });
}

// Randevu formu gönderimi
document.addEventListener('DOMContentLoaded', function() {
    const randevuForm = document.getElementById('randevuForm');
    if (randevuForm) {
        randevuForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('ad').value,
                tc_no: document.getElementById('tc').value,
                phone: document.getElementById('telefon')?.value,
                email: document.getElementById('email')?.value,
                department: document.getElementById('bolum').value,
                doctor_id: document.getElementById('doktor')?.value,
                appointment_date: document.getElementById('tarih').value,
                appointment_time: document.getElementById('saat')?.value,
                complaint: document.getElementById('sikayet')?.value
            };

            try {
                // Backend bağlantısı yapılana kadar sadece konsola yazdırıyoruz
                console.log('Randevu bilgileri:', formData);
                alert('Randevunuz başarıyla oluşturuldu!');
                randevuForm.reset();
            } catch (error) {
                console.error('Hata:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }
});

// İletişim formu gönderimi
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('ad').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('konu').value,
                message: document.getElementById('mesaj').value
            };

            try {
                // Backend bağlantısı yapılana kadar sadece konsola yazdırıyoruz
                console.log('İletişim formu bilgileri:', formData);
                alert('Mesajınız başarıyla gönderildi!');
                contactForm.reset();
            } catch (error) {
                console.error('Hata:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }
});

// Bölüm seçildiğinde doktorları güncelle
document.getElementById('bolum')?.addEventListener('change', async function() {
    const bolum = this.value;
    const doktorSelect = document.getElementById('doktor');

    if (doktorSelect) {
        try {
            // Backend bağlantısı yapılana kadar statik veriler
            const doktorlar = {
                'dahiliye': [
                    { id: 1, name: 'Dr. Ahmet Yılmaz' },
                    { id: 2, name: 'Dr. Ayşe Demir' }
                ],
                'kardiyoloji': [
                    { id: 3, name: 'Dr. Mehmet Demir' },
                    { id: 4, name: 'Dr. Fatma Yıldız' }
                ],
                'noroloji': [
                    { id: 5, name: 'Dr. Zeynep Çelik' },
                    { id: 6, name: 'Dr. Ali Kaya' }
                ],
                'ortopedi': [
                    { id: 7, name: 'Dr. Mustafa Aydın' },
                    { id: 8, name: 'Dr. Elif Yalçın' }
                ]
            };

            doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';
            if (bolum && doktorlar[bolum]) {
                doktorlar[bolum].forEach(doktor => {
                    doktorSelect.innerHTML += `<option value="${doktor.id}">${doktor.name}</option>`;
                });
            }
        } catch (error) {
            console.error('Doktorlar yüklenirken hata:', error);
        }
    }
});

// Splash screen
window.addEventListener('load', function() {
    setTimeout(function() {
        document.querySelector('.ana').style.opacity = '0';
        document.querySelector('.geri').style.opacity = '1';
    }, 3000);
});