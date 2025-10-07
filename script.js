// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Loading Screen
window.addEventListener('load', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

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
        
        // Show confirmation
        showNotification(`Paket ${paketName} dipilih! Silakan lengkapi form pemesanan.`, 'success');
    });
});

// Form Submission dengan Animasi
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        nama: document.getElementById('nama').value,
        telepon: document.getElementById('telepon').value,
        paket: document.getElementById('paket').value,
        tanggal: document.getElementById('tanggal').value,
        alamat: document.getElementById('alamat').value,
        catatan: document.getElementById('catatan').value
    };
    
    // Validation
    if (!validateForm(formData)) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
    }
    
    // Simulate processing
    setTimeout(() => {
        sendToWhatsApp(formData);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        this.reset();
    }, 2000);
});

// Form Validation
function validateForm(data) {
    if (!data.nama || !data.telepon || !data.paket || !data.tanggal || !data.alamat) {
        showNotification('Harap lengkapi semua field yang wajib diisi!', 'error');
        return false;
    }
    
    if (data.telepon.length < 10) {
        showNotification('Nomor telepon tidak valid!', 'error');
        return false;
    }
    
    const selectedDate = new Date(data.tanggal);
    const today = new Date();
    if (selectedDate < today) {
        showNotification('Tanggal acara tidak boleh di masa lalu!', 'error');
        return false;
    }
    
    return true;
}

// WhatsApp Integration
function sendToWhatsApp(data) {
    const paketText = data.paket === '1250000' ? 
        '👑 ROYAL BLESSING - Rp 1.250.000/50 Pax' : 
        '⭐ BLESSED ECONOMY - Rp 1.000.000';
    
    const message = `*GODBLESS CATERING - ORDER REQUEST*%0A%0A` +
                   `*Nama Pemesan:* ${data.nama}%0A` +
                   `*WhatsApp:* ${data.telepon}%0A` +
                   `*Paket Dipilih:* ${paketText}%0A` +
                   `*Tanggal Acara:* ${formatDate(data.tanggal)}%0A` +
                   `*Alamat:* ${data.alamat}%0A` +
                   `*Catatan Khusus:* ${data.catatan || 'Tidak ada'}%0A%0A` +
                   `_Pesan ➡ Panjar ➡ OK_%0A` +
                   `_Ongkir menyesuaikan lokasi_`;
    
    const phoneNumber = '6281234567890'; // Ganti dengan nomor catering
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank');
    
    showNotification('Pesanan berhasil! Anda akan diarahkan ke WhatsApp.', 'success');
}

// Date Formatting
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles if not exists
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 30px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                border-left: 4px solid #27ae60;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            .notification.error { border-left-color: #e74c3c; }
            .notification.warning { border-left-color: #f39c12; }
            .notification.info { border-left-color: #3498db; }
            .notification button {
                background: none;
                border: none;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            .notification button:hover { opacity: 1; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Set minimum date for date input
document.getElementById('tanggal').min = new Date().toISOString().split('T')[0];

// Add floating animation to food items
document.querySelectorAll('.food-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 2}s`;
});

// Add interactive hover effects to team cards
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Typing effect for hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Initialize typing effect on load
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        typeWriter(heroTitle, text, 80);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add confetti effect on form submission (optional)
function createConfetti() {
    const confettiCount = 100;
    const colors = ['#8B4513', '#D4AF37', '#FF6B35', '#27AE60', '#3498DB'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            opacity: ${Math.random() + 0.5};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 10000;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // Add confetti animation styles
    if (!document.querySelector('#confetti-styles')) {
        const styles = document.createElement('style');
        styles.id = 'confetti-styles';
        styles.textContent = `
            @keyframes confettiFall {
                0% { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(100vh) rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Add confetti to successful form submission
document.getElementById('orderForm').addEventListener('submit', function() {
    setTimeout(createConfetti, 1500);
});

console.log('🎉 GODBLESS CATERING Website loaded successfully!');
console.log('✨ Created with love by Michael, Jonathan & Chelsea');