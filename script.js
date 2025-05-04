// === DOKTORLAR SAYFASI İÇİN ===
async function fetchDoctors() {
    try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const doctors = await response.json();

        const doctorListDiv = document.getElementById('doctor-list');
        if (!doctorListDiv) return;
        doctorListDiv.innerHTML = '';

        doctors.forEach(doctor => {
            const bolum = doctor.specialty.toLowerCase();

            const doctorCard = document.createElement('div');
            doctorCard.className = 'doktor-kart';
            doctorCard.setAttribute('data-bolum', bolum);

            doctorCard.innerHTML = `
                <div class="doktor-detay">
                    <h3>${doctor.name}</h3>
                    <p class="uzmanlik">${doctor.specialty} Uzmanı</p>
                    <div class="doktor-bilgi">
                        <p><strong>Uzmanlık:</strong> ${doctor.specialty}</p>
                        <p><strong>Telefon:</strong> ${doctor.phone || '-'}</p>
                        <p><strong>Email:</strong> ${doctor.email || '-'}</p>
                    </div>
                    <button onclick="window.location.href='index.html#randevu'" class="randevu-btn">Randevu Al</button>
                </div>
            `;
            doctorListDiv.appendChild(doctorCard);
        });
    } catch (error) {
        console.error('Doktorlar alınırken hata oluştu:', error);
    }
}

function doktorlariFiltrele() {
    const secilenBolum = document.getElementById('bolum').value.toLowerCase();
    const doktorKartlari = document.querySelectorAll('.doktor-kart');

    doktorKartlari.forEach(kart => {
        if (secilenBolum === 'tumbolumler' || kart.getAttribute('data-bolum') === secilenBolum) {
            kart.style.display = '';
        } else {
            kart.style.display = 'none';
        }
    });
}

// === RANDEVU FORMU İÇİN ===
async function doktorlariGetirVeDoldur() {
    const bolumSelect = document.getElementById('bolum');
    const doktorSelect = document.getElementById('doktor');
    if (!bolumSelect || !doktorSelect) return;

    const seciliBolum = bolumSelect.value;
    doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';

    if (!seciliBolum) return;

    try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const doctors = await response.json();

        // Her iki tarafı da küçük harfe çevirerek karşılaştır
        const uygunDoktorlar = doctors.filter(
            doktor => doktor.specialty && doktor.specialty.toLowerCase() === seciliBolum.toLowerCase()
        );

        if (uygunDoktorlar.length === 0) {
            doktorSelect.innerHTML = '<option value="">Bu bölümde doktor bulunamadı</option>';
        } else {
            doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';
            uygunDoktorlar.forEach(doktor => {
                const option = document.createElement('option');
                option.value = doktor._id;
                option.textContent = doktor.name;
                doktorSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Doktorlar alınırken hata oluştu:', error);
        doktorSelect.innerHTML = '<option value="">Doktorlar yüklenemedi</option>';
    }
}

async function randevuOlustur(e) {
    e.preventDefault();

    const form = e.target;
    const randevuBilgileri = {
        patientName: form.ad.value,
        patientEmail: form.email.value,
        patientPhone: form.telefon.value,
        doctorId: form.doktor.value,
        appointmentDate: form.tarih.value,
        appointmentTime: form.saat.value,
        complaint: form.sikayet.value
    };

    try {
        const response = await fetch('http://localhost:3000/api/appointments-mongo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(randevuBilgileri)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Randevunuz başarıyla oluşturuldu!');
            form.reset();
            // Doktor select'i tekrar başa al
            const doktorSelect = document.getElementById('doktor');
            if (doktorSelect) {
                doktorSelect.innerHTML = '<option value="">Önce Bölüm Seçiniz</option>';
            }
        } else {
            alert('Hata: ' + (result.error || 'Randevu oluşturulamadı.'));
        }
    } catch (error) {
        alert('Sunucu hatası: ' + error.message);
    }
}

// === GENEL DOMContentLoaded ===
document.addEventListener('DOMContentLoaded', function() {
    // Doktorlar sayfası için
    if (window.location.pathname.includes('doktorlar.html')) {
        fetchDoctors();
        const bolumSelect = document.getElementById('bolum');
        if (bolumSelect) {
            bolumSelect.addEventListener('change', doktorlariFiltrele);
        }
    }

    // Randevu formu için
    const bolumSelect = document.getElementById('bolum');
    const doktorSelect = document.getElementById('doktor');
    const randevuForm = document.getElementById('randevuForm');

    if (bolumSelect && doktorSelect && window.location.pathname.includes('randevu.html')) {
        bolumSelect.addEventListener('change', doktorlariGetirVeDoldur);
        // Sayfa ilk açıldığında doktor select'i temizle
        doktorSelect.innerHTML = '<option value="">Önce Bölüm Seçiniz</option>';
    }

    if (randevuForm) {
        randevuForm.addEventListener('submit', randevuOlustur);
    }
});

