// Loading Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.querySelector('.loading-screen').style.display = 'none';
    }, 1000);
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu
            navMenu.classList.remove('active');
        }
    });
});

// Package Selection
document.querySelectorAll('.order-btn').forEach(button => {
    button.addEventListener('click', function() {
        const paketName = this.getAttribute('data-paket');
        const paketValue = paketName.includes('Royal') ? '1250000' : '1000000';
        
        document.getElementById('paket').value = paketValue;
        
        // Scroll to form
        document.getElementById('pesan').scrollIntoView({
            behavior: 'smooth'
        });
        
        alert(`Paket ${paketName} dipilih! Silakan lengkapi form.`);
    });
});

// Form Submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nama: document.getElementById('nama').value,
        telepon: document.getElementById('telepon').value,
        paket: document.getElementById('paket').value,
        tanggal: document.getElementById('tanggal').value,
        alamat: document.getElementById('alamat').value
    };
    
    // Validation
    if (!formData.nama || !formData.telepon || !formData.paket || !formData.tanggal || !formData.alamat) {
        alert('Harap lengkapi semua field!');
        return;
    }
    
    // Send to WhatsApp
    const paketText = formData.paket === '1250000' ? 
        '👑 ROYAL BLESSING - Rp 1.250.000/50 Pax' : 
        '⭐ BLESSED ECONOMY - Rp 1.000.000';
    
    const message = `Halo GODBLESS CATERING!%0A%0A` +
                   `Saya ingin memesan:%0A` +
                   `Nama: ${formData.nama}%0A` +
                   `WhatsApp: ${formData.telepon}%0A` +
                   `Paket: ${paketText}%0A` +
                   `Tanggal: ${formData.tanggal}%0A` +
                   `Alamat: ${formData.alamat}%0A%0A` +
                   `_Pesan ➡ Panjar ➡ OK_%0A` +
                   `_Ongkir menyesuaikan lokasi_`;
    
    const phoneNumber = '6287761329975'; // NOMOR GODBLESS CATERING
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappURL, '_blank');
    this.reset();
    alert('Pesanan berhasil! Anda akan diarahkan ke WhatsApp.');
});

// Set minimum date for date input
document.getElementById('tanggal').min = new Date().toISOString().split('T')[0];

// Navbar background on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.glass-header');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 248, 240, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 248, 240, 0.95)';
    }
});

// WhatsApp Float Button
document.querySelector('.wa-button').addEventListener('click', function(e) {
    e.preventDefault();
    const phoneNumber = '6287761329975'; // NOMOR GODBLESS CATERING
    const message = 'Halo GODBLESS CATERING! Saya ingin bertanya tentang paket catering.';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
});

console.log('GODBLESS CATERING website loaded! 🎉');
console.log('WhatsApp: +6287761329975');
