// Doktor filtreleme fonksiyonu
function doktorlariFiltrele() {
    const seciliBolum = document.getElementById('bolum').value;
    const doktorKartlari = document.querySelectorAll('.doktor-kart');

    doktorKartlari.forEach(kart => {
        if (secilenBolum === 'tumbolumler' || kart.dataset.bolum === seciliBolum) {
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
        randevuForm.addEventListener('submit', randevuOlustur);
    }

    // Bölüm seçildiğinde doktorları dinamik olarak backend'den çek
    const bolumSelect = document.getElementById('bolum');
    const doktorSelect = document.getElementById('doktor');
    const tarihInput = document.getElementById('tarih');
    const saatSelect = document.getElementById('saat');

    if (bolumSelect && doktorSelect) {
        bolumSelect.addEventListener('change', async function() {
            const bolum = this.value;
            doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';

            if (bolum) {
                try {
                    // API'den doktorları çek
                    const response = await fetch('/api/doctors');
                    const doctors = await response.json();

                    // Seçilen bölüme göre filtrele
                    const uygunDoktorlar = doctors.filter(
                        doktor => doktor.specialty && doktor.specialty.toLowerCase() === bolum.toLowerCase()
                    );

                    if (uygunDoktorlar.length > 0) {
                        uygunDoktorlar.forEach(doktor => {
                            const option = document.createElement('option');
                            option.value = doktor._id;
                            option.textContent = doktor.name;
                            doktorSelect.appendChild(option);
                        });
                    } else {
                        doktorSelect.innerHTML = '<option value="">Bu bölümde doktor bulunamadı</option>';
                    }
                } catch (error) {
                    console.error('Doktorlar yüklenirken hata:', error);
                    doktorSelect.innerHTML = '<option value="">Doktorlar yüklenemedi</option>';
                }
            } else {
                doktorSelect.innerHTML = '<option value="">Önce Bölüm Seçiniz</option>';
            }
        });
    }

    // Doktor veya tarih değişince alınan saatleri disable yap
    async function updateAvailableTimes() {
        const doktorId = doktorSelect?.value;
        const tarih = tarihInput?.value;
        const tumSaatler = [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "13:30", "14:00", "14:30", "15:00"
        ];

        if (saatSelect) {
            // Önce tüm saatleri aktif yap
            saatSelect.innerHTML = '<option value="">Seçiniz</option>';
            tumSaatler.forEach(saat => {
                const option = document.createElement('option');
                option.value = saat;
                option.textContent = saat;
                saatSelect.appendChild(option);
            });

            if (doktorId && tarih) {
                try {
                    const response = await fetch(`/api/appointments-mongo/booked-times?doctorId=${doktorId}&appointmentDate=${tarih}`);
                    const bookedTimes = await response.json();

                    // Alınan saatleri disable yap
                    Array.from(saatSelect.options).forEach(option => {
                        if (bookedTimes.includes(option.value)) {
                            option.disabled = true;
                            option.textContent += " (Dolu)";
                        }
                    });
                } catch (error) {
                    console.error("Saatler alınırken hata:", error);
                }
            }
        }
    }

    doktorSelect?.addEventListener('change', updateAvailableTimes);
    tarihInput?.addEventListener('change', updateAvailableTimes);

    // İletişim formu gönderimi
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
                // Backend'e POST isteği gönder
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Mesajınız başarıyla gönderildi!');
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    alert('Hata: ' + (result.error || 'Mesaj gönderilemedi.'));
                }
            } catch (error) {
                console.error('Hata:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }
});

// Splash screen
window.addEventListener('load', function() {
    if (document.querySelector('.ana') && document.querySelector('.geri')) {
        setTimeout(function() {
            document.querySelector('.ana').style.opacity = '0';
            document.querySelector('.geri').style.opacity = '1';
        }, 3000);
    }
});

async function randevuOlustur(e) {
    e.preventDefault();

    const form = e.target;
    const tarih = new Date(form.tarih.value);
    const isoTarih = tarih.toISOString().split('T')[0];
    
    // Debug için form verilerini kontrol et
    console.log('Form verileri:', {
        ad: form.ad.value,
        email: form.email.value,
        telefon: form.telefon.value,
        doktor: form.doktor.value,
        tarih: isoTarih,
        saat: form.saat.value,
        sikayet: form.sikayet.value
    });

    const randevuBilgileri = {
        patientName: form.ad.value,
        patientEmail: form.email.value,
        patientPhone: form.telefon.value,
        doctorId: form.doktor.value,
        date: isoTarih,
        time: form.saat.value,
        complaint: form.sikayet.value
    };

    // Debug için gönderilecek verileri kontrol et
    console.log('Gönderilecek veriler:', randevuBilgileri);

    try {
        const response = await fetch('/api/appointments-mongo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(randevuBilgileri)
        });

        const result = await response.json();
        console.log('Backend yanıtı:', result);

        if (response.ok) {
            alert('Randevunuz başarıyla oluşturuldu!');
            form.reset();
            // Doktor select'i tekrar başa al
            const doktorSelect = document.getElementById('doktor');
            if (doktorSelect) {
                doktorSelect.innerHTML = '<option value="">Önce Bölüm Seçiniz</option>';
            }
        } else if (response.status === 409 || (result && result.error && result.error.includes('zaten bir randevu var'))) {
            alert('Bu doktor için seçilen gün ve saatte zaten bir randevu var. Lütfen başka bir saat seçiniz.');
        } else {
            alert('Hata: ' + (result.error || 'Randevu oluşturulamadı.'));
        }
    } catch (error) {
        console.error('Hata detayı:', error);
        alert('Sunucu hatası: ' + error.message);
    }
}
