const API_BASE_URL = 'http://localhost:3000/api';

// Kullanıcı kimlik doğrulama işlemleri
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/users-mongo/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Giriş başarısız');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Başarılı giriş mesajı
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
        loginMessage.className = 'message success';
        loginMessage.style.display = 'block';
        
        // 2 saniye sonra yönlendir
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } catch (error) {
        console.error('Login error:', error);
        const loginMessage = document.getElementById('loginMessage');
        loginMessage.textContent = error.message;
        loginMessage.className = 'message error';
        loginMessage.style.display = 'block';
    }
}

async function register(name, email, password, phone) {
    try {
        const response = await fetch(`${API_BASE_URL}/users-mongo/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Kayıt başarısız');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Başarılı kayıt mesajı
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.textContent = 'Kayıt başarılı! Yönlendiriliyorsunuz...';
        registerMessage.className = 'message success';
        registerMessage.style.display = 'block';
        
        // 2 saniye sonra yönlendir
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } catch (error) {
        console.error('Register error:', error);
        const registerMessage = document.getElementById('registerMessage');
        registerMessage.textContent = error.message;
        registerMessage.className = 'message error';
        registerMessage.style.display = 'block';
    }
}

// Doktorları getir
async function getDoctors() {
    try {
        const response = await fetch(`${API_BASE_URL}/doctors`);
        if (!response.ok) {
            throw new Error('Doktorlar yüklenemedi');
        }
        const doctors = await response.json();
        updateDoctorsList(doctors);
    } catch (error) {
        console.error('Doktorlar yüklenirken hata:', error);
    }
}

// Doktor listesini güncelle
function updateDoctorsList(doctors) {
    const doctorsList = document.getElementById('doktorlar-listesi');
    if (doctorsList) {
        doctorsList.innerHTML = doctors.map(doctor => {
            // Çalışma günlerini formatla
            const workingDays = doctor.availableHours.map(hour => hour.day).join(' - ');

            return `
            <div class="doktor-kart" data-bolum="${doctor.specialization}">
                <h3>Dr. ${doctor.name}</h3>
                <p class="uzmanlik">${doctor.specialization} Uzmanı</p>
                <div class="doktor-bilgi">
                    <p><strong>Deneyim:</strong> ${doctor.experience} Yıl</p>
                    <p><strong>Eğitim:</strong> ${doctor.education}</p>
                    <p><strong>Çalışma Günleri:</strong> ${workingDays}</p>
                </div>
                <button class="randevu-btn" onclick="toggleAppointmentForm(this)">Randevu Al</button>
                <div class="appointment-form-container" style="display: none;">
                    <div class="form-group">
                        <label for="time-select-${doctor._id}">Saat Seçin</label>
                        <select id="time-select-${doctor._id}" class="time-select">
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="sikayet-${doctor._id}">Şikayetiniz</label>
                        <input type="text" id="sikayet-${doctor._id}" class="sikayet-input" placeholder="Açıklama">
                    </div>
                    <button class="randevu-olustur-btn" data-doctor-id="${doctor._id}">Randevu Oluştur</button>
                </div>
            </div>
        `;
        }).join('');
    }
}

// Form işlemleri
document.addEventListener('DOMContentLoaded', () => {
    // Form geçiş butonları
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });

        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
    }

    // Login form işlemi
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            await login(email, password);
        });
    }

    // Register form işlemi
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const phone = document.getElementById('registerPhone').value;
            await register(name, email, password, phone);
        });
    }

    // Ana sayfa butonları
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            window.location.href = 'randevu.html';
        });
    }

    const userButton = document.querySelector('.user-button');
    if (userButton) {
        userButton.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'user.html';
            }
        });
    }

    // Doktorlar sayfası için
    if (window.location.pathname.includes('doktorlar.html')) {
        getDoctors();
        const bolumSelect = document.getElementById('bolum');
        if (bolumSelect) {
            bolumSelect.addEventListener('change', doktorlariFiltrele);
        }
    }

    // Randevu sayfası için
    if (window.location.pathname.includes('randevu.html')) {
        const bolumSelect = document.getElementById('bolum');
        const doktorSelect = document.getElementById('doktor');
        
        if (bolumSelect && doktorSelect) {
            bolumSelect.addEventListener('change', async function() {
                const seciliBolum = this.value;
                doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';

                if (seciliBolum) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/doctors`);
                        const doctors = await response.json();
                        
                        const uygunDoktorlar = doctors.filter(
                            doktor => doktor.specialization.toLowerCase() === seciliBolum.toLowerCase()
                        );

                        uygunDoktorlar.forEach(doktor => {
                            const option = document.createElement('option');
                            option.value = doktor._id;
                            option.textContent = `Dr. ${doktor.name}`;
                            doktorSelect.appendChild(option);
                        });
                    } catch (error) {
                        console.error('Doktorlar yüklenirken hata:', error);
                        doktorSelect.innerHTML = '<option value="">Doktorlar yüklenemedi</option>';
                    }
                }
            });
        }
    }

    // Kullanıcı durumunu güncelle
    updateUserStatus();
    updateWelcomeMessage();
});

// Kullanıcı durumunu güncelleme
function updateUserStatus() {
    const userStatusContainer = document.getElementById('user-status-container');
    const randevularimBtn = document.getElementById('randevularim-btn');
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token) {
        userStatusContainer.innerHTML = `
            <a href="dashboard.html" class="user-button" id="randevularim-btn">Randevularım</a>
            <button onclick="logout()" class="user-button">Çıkış Yap</button>
        `;
    } else {
        userStatusContainer.innerHTML = `
            <a href="user.html" class="user-button">Kullanıcı Girişi</a>
        `;
    }
}

// Çıkış yapma
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function toggleAppointmentForm(button) {
    const formContainer = button.nextElementSibling;
    if (formContainer.style.display === 'none') {
        formContainer.style.display = 'block';
        button.textContent = 'Formu Kapat';
    } else {
        formContainer.style.display = 'none';
        button.textContent = 'Randevu Al';
    }
}

async function randevuOlustur(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Kullanıcı kontrolü
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Randevu almak için giriş yapmalısınız!');
        window.location.href = 'user.html';
        return;
    }

    const randevuBilgileri = {
        patientName: user.name,
        patientEmail: user.email,
        patientPhone: formData.get('telefon'),
        doctorId: formData.get('doktor'),
        date: formData.get('tarih'),
        time: formData.get('saat'),
        complaint: formData.get('sikayet'),
        status: 'pending'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/appointments-mongo`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(randevuBilgileri)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Randevunuz başarıyla oluşturuldu!');
            window.location.href = 'dashboard.html';
        } else if (response.status === 409) {
            alert('Bu doktor için seçilen gün ve saatte zaten bir randevu var. Lütfen başka bir saat seçiniz.');
        } else {
            alert('Hata: ' + (result.error || 'Randevu oluşturulamadı.'));
        }
    } catch (error) {
        console.error('Hata detayı:', error);
        alert('Sunucu hatası: ' + error.message);
    }
}

// Doktorları filtreleme fonksiyonu
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

// Ana sayfa hoşgeldin mesajını güncelle
function updateWelcomeMessage() {
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) {
            welcomeText.textContent = `Hoşgeldin ${user.name}`;
        } else {
            welcomeText.textContent = 'Hoşgeldiniz';
        }
    }
}

// Bölümlere göre doktor listesi
const doktorlar = {
    dahiliye: [
        { id: '65f1a2b3c4d5e6f7g8h9i0j1', name: 'Dr. Ahmet Yılmaz' },
        { id: '65f1a2b3c4d5e6f7g8h9i0j2', name: 'Dr. Ayşe Kaya' }
    ],
    kardiyoloji: [
        { id: '65f1a2b3c4d5e6f7g8h9i0j3', name: 'Dr. Mehmet Demir' },
        { id: '65f1a2b3c4d5e6f7g8h9i0j4', name: 'Dr. Fatma Şahin' }
    ],
    noroloji: [
        { id: '65f1a2b3c4d5e6f7g8h9i0j5', name: 'Dr. Ali Öztürk' },
        { id: '65f1a2b3c4d5e6f7g8h9i0j6', name: 'Dr. Zeynep Çelik' }
    ],
    ortopedi: [
        { id: '65f1a2b3c4d5e6f7g8h9i0j7', name: 'Dr. Mustafa Aydın' },
        { id: '65f1a2b3c4d5e6f7g8h9i0j8', name: 'Dr. Elif Yıldız' }
    ]
};
