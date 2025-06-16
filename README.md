# 🏥 **Hospital Appointment System**

![Tablo](images/Tablo.png)

## **🔎 Proje Hakkında**

**Hospital Appointment System**, modern ve kullanıcı dostu bir arayüz ile hastaların online olarak randevu almasını sağlayan kapsamlı bir web uygulamasıdır. Proje, sağlık merkezlerinin dijitalleşmesine katkı sunmak ve hasta memnuniyetini artırmak amacıyla geliştirilmiştir.

## **🚀 Özellikler**

- Online randevu alma ve yönetme
- Kullanıcıya özel dashboard sayfası ile randevuları görüntüleme ve iptal etme
- Kullanıcı profil bilgilerini düzenleme (Ad, Telefon)
- Doktor ve bölüm filtreleme
- Dinamik doktor listesi
- Randevu onay ekranı ve kullanıcı bilgilendirmesi
- Modern ve responsive (mobil uyumlu) tasarım
- Kullanıcı dostu arayüz
- SQL veritabanı ile veri yönetimi (MongoDB entegrasyonu)
- Gelişmiş kullanıcı kimlik doğrulama ve oturum yönetimi
- İletişim ve hakkımızda sayfaları
- **Geliştirilmiş Navigasyon ve Buton Hizalamaları**

## **🖥️ Ekran Görüntüsü**

### Son Versiyonumuzdan Örnekler

![Ana Sayfa](images/homepage.png)
![Doktorlar Sayfası](images/doctors.png)
![İletişim Sayfası](images/contact.png)

## **📂 Proje Dosya Yapısı**

- `index.html` : Ana sayfa
- `randevu.html` : Online randevu formu
- `doktorlar.html` : Doktor listesi ve filtreleme
- `hakkımızda.html` : Kurum hakkında bilgiler
- `iletisim.html` : İletişim formu ve bilgiler
- `dashboard.html` : Kullanıcı randevularının görüntülendiği kişisel panel
- `profile.html` : Kullanıcı profil düzenleme sayfası
- `user.html` : Kullanıcı giriş ve kayıt sayfası
- `script.js` : Tüm sayfalarda kullanılan JavaScript dosyası
- `style.css` : Tüm sayfalarda kullanılan stil dosyası
- `hospital_appointment_system.sql` : SQL veritabanı şeması ve örnek veriler
- `images/` : Proje görselleri

## **⚙️ Kurulum**

1. **Projeyi İndirin:**
   - Bu repoyu bilgisayarınıza klonlayın veya ZIP olarak indirin.

2. **Veritabanı Kurulumu:**
   - `hospital_appointment_system.sql` dosyasını bir MySQL/MariaDB veritabanına içe aktarın.
   - Veritabanı adı: `hospital appointment system`
   - Not: Proje artık MongoDB ile de entegre çalışmaktadır. Gerekli MongoDB ayarlarını backend (sunucu) tarafında yapmanız gerekebilir.

3. **Projeyi Çalıştırma:**
   - Tüm dosyaları bir web sunucusunda (ör. XAMPP, WAMP veya canlı sunucu) çalıştırabilirsiniz.
   - `index.html` dosyasını tarayıcıda açarak kullanmaya başlayabilirsiniz.
   - API servisinizin (backend) doğru şekilde çalıştığından ve `http://localhost:3000/api` adresinde erişilebilir olduğundan emin olun.

## **📝 Kullanım**

- **Kullanıcı Girişi/Kaydı:**
  - Sağ üstteki "Kullanıcı Girişi" butonuna tıklayarak veya `user.html` sayfasına giderek kayıt olabilir veya mevcut hesabınızla giriş yapabilirsiniz.
- **Randevu Al:**
  - Ana sayfadan, "Randevu Al" sayfasından veya doktorlar sayfasındaki doktor kartlarından gerekli bilgileri doldurarak randevu oluşturabilirsiniz.
  - Randevu oluşturduktan sonra randevularınızın listelendiği dashboard sayfasına yönlendirilirsiniz.
- **Randevuları Görüntüle ve İptal Et:**
  - Giriş yaptıktan sonra "Randevularım" veya "Dashboard" butonuna tıklayarak mevcut randevularınızı görebilir, durumlarını takip edebilir ve iptal edebilirsiniz.
- **Profil Düzenleme:**
  - Dashboard sayfasındaki "✏️ Profilimi Düzenle" butonuna tıklayarak adınızı ve telefon numaranızı güncelleyebilirsiniz.
- **Doktorları Görüntüle ve Randevu Al:**
  - `doktorlar.html` sayfasında bölüm seçerek ilgili doktorları filtreleyebilir ve doğrudan doktor kartları üzerinden randevu oluşturabilirsiniz.
- **İletişim:**
  - `iletisim.html` sayfasından sağlık merkeziyle iletişime geçebilirsiniz. İletişim bilgileri ve formu ortalanmış, navigasyon butonları düzgün hizalanmıştır.

## **🎬 Tanıtım ve Kullanım Videosu**

[![Genel Kullanım Videosu](https://img.youtube.com/vi/onhseOTODNM/0.jpg)](https://youtu.be/onhseOTODNM)

Bu videoda sistemin genel kullanımını ve temel işlevlerini izleyebilirsiniz.

---

[![Çoklu Randevu Hata Testi](https://img.youtube.com/vi/_CDqyWwILNs/0.jpg)](https://youtu.be/_CDqyWwILNs)

Bu videoda, birden fazla randevu alındığında sistemin hata kodu gösterilmiştir.

## **📄 Lisans**

Bu proje, eğitim ve demo amaçlıdır. Ticari kullanım için lütfen proje sahibinden izin alınız.

## **🔧 Çalışma Prensibi ve Kullanılan Teknolojiler**

**Hospital Appointment System**, tamamen istemci tarafında çalışan bir web uygulamasıdır. Kullanıcılar, modern ve responsive arayüz üzerinden kolayca randevu oluşturabilir, doktor ve bölüm filtrelemesi yapabilir, iletişim ve bilgi sayfalarına ulaşabilirler.

### **Kullanılan Diller ve Teknolojiler**

- **HTML5**: Sayfa yapısı ve içerik için
- **CSS3**: Modern ve mobil uyumlu tasarım için
- **JavaScript (Vanilla JS)**: Dinamik işlemler, form kontrolleri ve kullanıcı etkileşimi için (API entegrasyonu)
- **SQL (MySQL/MariaDB)**: Randevu, doktor ve hasta verilerinin yönetimi için (veritabanı şeması ve örnek verilerle)
- **MongoDB**: Kullanıcı ve randevu verilerinin yönetimi için (backend entegrasyonu gerektirir)

### **Sitenin Yapabilecekleri**

- Hastalar için online randevu oluşturma ve onaylama
- Doktor ve bölüm bazında filtreleme ve listeleme
- Randevu saat ve tarih seçimi
- Kullanıcı dostu, hızlı ve mobil uyumlu arayüz
- Kurum hakkında bilgi ve iletişim formu
- Randevuları görüntüleme ve iptal etme (dashboard üzerinden)
- Kullanıcı profil bilgilerini düzenleme
- Gelişmiş hata yönetimi ve kullanıcı geri bildirimleri

> **Not:** Proje, temel olarak front-end (istemci tarafı) teknolojileriyle geliştirilmiştir. Veritabanı işlemleri için örnek SQL dosyası sunulmuştur. Gelişmiş back-end entegrasyonu ve MongoDB kullanımı için ek geliştirme yapılmıştır. API servisinizin doğru şekilde çalıştığından emin olun.