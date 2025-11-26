// --- SMOOTH SCROLL WITH LERP ---
let scrollY = window.scrollY;
let targetScrollY = window.scrollY;
const lerp = (start, end, factor) => start + (end - start) * factor;

function smoothScroll() {
    targetScrollY = window.scrollY;
    scrollY = lerp(scrollY, targetScrollY, 0.08); // Adjust for butteriness
    
    // Apply parallax to images
    document.querySelectorAll('.parallax-image').forEach(img => {
        const rect = img.parentElement.getBoundingClientRect();
        const speed = 0.5;
        const yPos = rect.top * speed;
        img.style.transform = `translateY(${yPos}px)`;
    });
    
    requestAnimationFrame(smoothScroll);
}

// --- ENHANCED INTERSECTION OBSERVER ---
const observerOptions = {
    threshold: [0, 0.1, 0.25, 0.5],
    rootMargin: "0px 0px -10% 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add active class with delay for stagger effect
            if (entry.target.classList.contains('reveal-stagger')) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay * 100);
            } else {
                entry.target.classList.add('active');
            }
            
            // Trigger count animation for stats
            if (entry.target.classList.contains('stat-number')) {
                animateValue(entry.target);
            }
            
            // Image reveal animation
            if (entry.target.classList.contains('image-reveal')) {
                entry.target.classList.add('revealed');
            }
        }
    });
}, observerOptions);

// --- NUMBER COUNTER ANIMATION ---
function animateValue(element) {
    if (element.dataset.counted) return;
    element.dataset.counted = true;
    
    const target = parseFloat(element.textContent.replace(/[^0-9.-]/g, ''));
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    element.classList.add('counting');
    
    const updateNumber = () => {
        current += increment;
        if (current < target) {
            element.textContent = formatNumber(current, element.dataset.format);
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = element.dataset.original || formatNumber(target, element.dataset.format);
            element.classList.remove('counting');
        }
    };
    
    updateNumber();
}

function formatNumber(num, format) {
    if (format === 'currency') {
        return '$' + num.toFixed(2);
    } else if (format === 'percentage') {
        return num.toFixed(1) + '%';
    } else if (format === 'decimal') {
        return num.toFixed(1);
    } else {
        return Math.floor(num).toLocaleString();
    }
}

// --- MENU TOGGLE ENHANCED ---
function toggleMenu() {
    const menu = document.getElementById('fsMenu');
    const menuItems = menu.querySelectorAll('.menu-link');
    
    menu.classList.toggle('active');
    
    if (menu.classList.contains('active')) {
        // Stagger menu items animation
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0)';
                item.style.opacity = '1';
            }, 100 + (index * 50));
        });
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
    } else {
        menuItems.forEach(item => {
            item.style.transform = 'translateY(120%)';
            item.style.opacity = '0';
        });
        
        // Unlock body scroll
        document.body.style.overflow = '';
    }
}

// --- IMAGE LOADING WITH FADE ---
function loadImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// --- CURSOR EFFECTS (Optional) ---
function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effects
    document.querySelectorAll('a, button, .menu-link').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Start smooth scroll
    requestAnimationFrame(smoothScroll);
    
    // Initialize reveal animations
    document.querySelectorAll('.reveal, .reveal-stagger, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize image reveals
    document.querySelectorAll('.content-image').forEach(img => {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-reveal';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        observer.observe(wrapper);
    });
    
    // Initialize stat counters
    document.querySelectorAll('.stat-item h3').forEach(el => {
        el.classList.add('stat-number');
        el.dataset.original = el.textContent;
        el.dataset.format = el.textContent.includes('$') ? 'currency' : 
                           el.textContent.includes('%') ? 'percentage' :
                           el.textContent.includes('.') ? 'decimal' : 'number';
        observer.observe(el);
    });
    
    // Initialize module headers
    document.querySelectorAll('.module-header').forEach(el => {
        observer.observe(el);
    });
    
    // Preloader with smooth exit
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Trigger hero animations after preloader
            setTimeout(() => {
                document.querySelectorAll('#hero .reveal').forEach((el, i) => {
                    setTimeout(() => el.classList.add('active'), i * 100);
                });
            }, 300);
        }, 800);
    }
    
    // Load images
    loadImages();
    
    // Optional: Initialize custom cursor
    // initCursor();
});

// --- ADDITIONAL CSS FOR CURSOR (Add to CSS if using) ---
/*
.custom-cursor {
    width: 20px;
    height: 20px;
    border: 2px solid var(--white);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: all 0.1s ease;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
}

.custom-cursor.hover {
    width: 40px;
    height: 40px;
    background: var(--accent);
    border-color: var(--accent);
}

img.loaded {
    animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
*/
