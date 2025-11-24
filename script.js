// --- SCROLL ANIMATION OBSERVER ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Reveal Animations
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Preloader Removal
    setTimeout(() => {
        document.querySelector('.preloader').classList.add('hidden');
    }, 800);
});

// --- MENU TOGGLE ---
function toggleMenu() {
    const menu = document.getElementById('fsMenu');
    menu.classList.toggle('active');
    
    // Animate items
    const items = menu.querySelectorAll('.menu-item');
    if (menu.classList.contains('active')) {
        items.forEach((item, index) => {
            item.style.transitionDelay = `${0.1 + (index * 0.1)}s`;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    } else {
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transitionDelay = '0s';
        });
    }
}
