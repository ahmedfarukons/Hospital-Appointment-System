<<<<<<< HEAD:other-version/script.js
document.addEventListener('DOMContentLoaded', function() {
    const geri = document.querySelector('.geri');
    const ana = document.querySelector('.ana');
    
    // Sayfa ilk yüklendiğinde
    if (!sessionStorage.getItem('sayfaYuklendi')) {
        geri.style.opacity = 0;
        ana.style.opacity = 1;
        
        setTimeout(() => {
            geri.style.opacity = 1;
            ana.style.opacity = 0;
            sessionStorage.setItem('sayfaYuklendi', 'true');
        }, 3000);
    } else {
        // Sayfa yeniden yüklendiğinde veya diğer sayfalardan geldiğinde
        geri.style.opacity = 1;
        ana.style.opacity = 0;
    }

    const bolumSelect = document.getElementById('bolum');
    const doktorSelect = document.getElementById('doktor');
    const randevuForm = document.getElementById('randevuForm');

    // Bölümlere göre doktor listesi
    const doktorlar = {
        dahiliye: ['Dr. Ahmet Yılmaz', 'Dr. Ayşe Kaya'],
        kardiyoloji: ['Dr. Mehmet Demir', 'Dr. Fatma Şahin'],
        noroloji: ['Dr. Ali Öztürk', 'Dr. Zeynep Çelik'],
        ortopedi: ['Dr. Mustafa Aydın', 'Dr. Elif Yıldız']
    };

    // Bölüm seçildiğinde doktor listesini güncelle
    if (bolumSelect && doktorSelect) {
        bolumSelect.addEventListener('change', function() {
            const seciliBolum = this.value;
            doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';

            if (seciliBolum) {
                doktorlar[seciliBolum].forEach(doktor => {
                    const option = document.createElement('option');
                    option.value = doktor;
                    option.textContent = doktor;
                    doktorSelect.appendChild(option);
                });
            }
        });
    }

    // Tarih seçimi için minimum tarih ayarı
    const tarihInput = document.getElementById('tarih');
    if (tarihInput) {
        const bugun = new Date().toISOString().split('T')[0];
        tarihInput.min = bugun;
    }

    // Form gönderildiğinde
    if (randevuForm) {
        randevuForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const randevuBilgileri = {
                adSoyad: document.getElementById('ad').value,
                tcNo: document.getElementById('tc').value,
                telefon: document.getElementById('telefon').value,
                email: document.getElementById('email').value,
                bolum: document.getElementById('bolum').value,
                doktor: document.getElementById('doktor').value,
                tarih: document.getElementById('tarih').value,
                saat: document.getElementById('saat').value,
                sikayet: document.getElementById('sikayet').value
            };

            console.log('Randevu oluşturuldu:', randevuBilgileri);
            alert('Randevunuz başarıyla oluşturuldu! SMS ile bilgilendirileceksiniz.');
            this.reset();
        });
    }

    // Tüm linkleri seç
    const links = document.querySelectorAll('nav a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if(this.getAttribute('href') !== window.location.pathname.split('/').pop()) {
                document.body.classList.add('loading');
            }
        });
    });

    // Bölüm seçimi değiştiğinde filtreleme yapılacak
    if (bolumSelect) {
        bolumSelect.addEventListener('change', doktorlariFiltrele);
    }
});

function doktorlariFiltrele() {
    const secilenBolum = document.getElementById('bolum').value;
    const doktorKartlari = document.querySelectorAll('.doktor-kart');

    doktorKartlari.forEach(kart => {
        if (secilenBolum === 'tumbolumler' || kart.getAttribute('data-bolum') === secilenBolum) {
            kart.style.display = 'block';
        } else {
            kart.style.display = 'none';
        }
    });
}

=======
// === DOKTORLAR SAYFASI İÇİN ===
console.log("Şu anki sayfa:", window.location.pathname);
async function fetchDoctors() {
    try {
        const response = await fetch('http://localhost:3000/api/doctors');
        const doctors = await response.json();

        const doctorListDiv = document.getElementById('doctor-list');
        if (!doctorListDiv) return;
        doctorListDiv.innerHTML = '';

        doctors.forEach(doctor => {
            const bolum = doctor.specialty ? doctor.specialty.toLowerCase() : '';

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
    // Bölüm seçilmediyse, doktor select'i sıfırla ve mesajı göster
    if (!seciliBolum) {
        doktorSelect.innerHTML = '<option value="">Önce Bölüm Seçiniz</option>';
        return;
    }

    doktorSelect.innerHTML = '<option value="">Doktorlar yükleniyor...</option>';

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
    
    // Debug için form verilerini kontrol et
    console.log('Form verileri:', {
        ad: form.ad.value,
        email: form.email.value,
        telefon: form.telefon.value,
        doktor: form.doktor.value,
        tarih: form.tarih.value,
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
        const response = await fetch('http://localhost:3000/api/appointments-mongo', {
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
>>>>>>> mmelih:script.js
