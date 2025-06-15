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
            window.location.href = 'index.html';
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
            window.location.href = 'index.html';
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
            bolumSelect.addEventListener('change', async () => {
                const seciliBolum = bolumSelect.value;
                if (!seciliBolum) {
                    doktorSelect.innerHTML = '<option value="">Önce Bölüm Seçiniz</option>';
                    return;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/doctors`);
                    const doctors = await response.json();
                    
                    const uygunDoktorlar = doctors.filter(
                        doktor => doktor.specialization.toLowerCase() === seciliBolum.toLowerCase()
                    );

                    doktorSelect.innerHTML = '<option value="">Doktor Seçiniz</option>';
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
            });
        }
    }

    // Kullanıcı durumunu güncelle
    updateUserStatus();
});

// Kullanıcı durumunu güncelleme
function updateUserStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userStatusContainer = document.getElementById('user-status-container');
    
    if (userStatusContainer) {
        if (user && user.name) {
            userStatusContainer.innerHTML = `
                <span style="color: white; margin-right: 10px;">Merhaba, ${user.name}</span>
                <button onclick="logout()" style="background-color: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Çıkış Yap</button>
            `;
        } else {
            userStatusContainer.innerHTML = `<a href="user.html" class="user-button">Kullanıcı Girişi</a>`;
        }
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

document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('randevu-olustur-btn')) {
        const doctorId = e.target.dataset.doctorId;
        const doctorCard = e.target.closest('.doktor-kart');
        const selectedTime = doctorCard.querySelector('.time-select').value;
        const complaint = doctorCard.querySelector('.sikayet-input').value;

        // Get user ID from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
            alert('Randevu oluşturmak için giriş yapmalısınız.');
            window.location.href = 'user.html'; // Redirect to login page
            return;
        }
        const userId = user._id;

        // You'll need a date for the appointment. For now, let's use a dummy date or get it from another input if available.
        // If there's no date picker on the doctor's page, you might need to add one or assume a date.
        const appointmentDate = new Date().toISOString().split('T')[0]; // Current date as YYYY-MM-DD

        try {
            const response = await fetch(`${API_BASE_URL}/appointments-mongo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 
                    userId: userId, 
                    doctorId: doctorId, 
                    date: appointmentDate, 
                    time: selectedTime, 
                    complaint: complaint 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Randevu oluşturulamadı');
            }

            alert('Randevu başarıyla oluşturuldu!');
            // Optionally, hide the form or update the UI after successful appointment
            toggleAppointmentForm(doctorCard.querySelector('.randevu-btn')); // Hide the form
        } catch (error) {
            console.error('Randevu oluşturulurken hata:', error);
            alert(error.message);
        }
    }
});

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
