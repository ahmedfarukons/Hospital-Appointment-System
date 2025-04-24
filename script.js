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

