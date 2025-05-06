// Kayıt
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const resultDiv = document.getElementById('registerResult');
    resultDiv.textContent = 'İşlem yapılıyor...';

    try {
        const response = await fetch('http://localhost:3000/api/users-mongo/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const result = await response.json();
        if (response.ok) {
            resultDiv.textContent = result.message;
        } else {
            resultDiv.textContent = result.error || 'Kayıt başarısız!';
        }
    } catch (err) {
        resultDiv.textContent = 'Sunucu hatası: ' + err.message;
    }
});

// Giriş
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const resultDiv = document.getElementById('loginResult');
    resultDiv.textContent = 'İşlem yapılıyor...';

    try {
        const response = await fetch('http://localhost:3000/api/users-mongo/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            resultDiv.textContent = result.message + ' (Token alındı)';
            // Token'ı localStorage'a kaydet
            localStorage.setItem('token', result.token);
            // 1 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
                window.location.href = 'index.html'; // veya başka bir sayfa
            }, 1000);
        } else {
            resultDiv.textContent = result.error || 'Giriş başarısız!';
        }
    } catch (err) {
        resultDiv.textContent = 'Sunucu hatası: ' + err.message;
    }
});
