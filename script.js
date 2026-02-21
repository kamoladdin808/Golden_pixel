(function () {
    const canvas = document.getElementById('heroCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 140;
    let mouse = { x: null, y: null, radius: 150 };
    let animationId = null;
    let isCanvasVisible = true;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticle(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${p.opacity})`;
        ctx.fill();
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!isCanvasVisible) return;

        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += dx / dist * force * 1.5;
                    p.y += dy / dist * force * 1.5;
                }
            }

            drawParticle(p);
        });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    const heroSection = document.getElementById('hero');
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isCanvasVisible = entry.isIntersecting;
            if (isCanvasVisible && !animationId) {
                animate();
            } else if (!isCanvasVisible && animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });
    }, { threshold: 0.05 });

    canvasObserver.observe(heroSection);

    window.addEventListener('resize', () => { resize(); createParticles(); });
    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    resize();
    createParticles();
    animate();
})();

(function () {
    const navbar = document.getElementById('navbar');
    const heroContent = document.querySelector('.hero-content');
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;

                navbar.classList.toggle('scrolled', scrolled > 60);

                if (scrolled < window.innerHeight) {
                    heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
                    heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
                }

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

(function () {
    const isPortfolioPage = document.querySelector('.portfolio-tabs') !== null;

    function makeElementsVisible() {
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    if (isPortfolioPage) {
        makeElementsVisible();
        setTimeout(makeElementsVisible, 50);
    } else {
        const revealElements = document.querySelectorAll('.reveal');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }
})();

function toggleMenu(open) {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    const navbar = document.getElementById('navbar');
    const isActive = open !== undefined ? open : burger.classList.toggle('active');
    burger.classList.toggle('active', isActive);
    menu.classList.toggle('active', isActive);
    navbar.classList.toggle('menu-open', isActive);
    burger.setAttribute('aria-expanded', isActive);
    burger.setAttribute('aria-label', isActive ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = isActive ? 'hidden' : '';

    if (isActive) {
        const firstLink = menu.querySelector('a');
        firstLink?.focus();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const menu = document.getElementById('mobileMenu');
        if (menu?.classList.contains('active')) {
            toggleMenu(false);
            document.getElementById('burger')?.focus();
        }
    }
});

(function () {
    function initPortfolioTabs() {
        const tabs = document.querySelectorAll('.portfolio-tab');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const portfolioGrid = document.getElementById('portfolio-grid');

        if (tabs.length > 0 && portfolioItems.length > 0) {
            function applyFilter(filter) {
                let visibleCount = 0;
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (category === filter) {
                        item.style.display = '';
                        item.style.visibility = 'visible';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                        item.classList.add('visible');
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
            }

            portfolioItems.forEach(item => {
                item.classList.add('visible');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });

            setTimeout(() => {
                applyFilter('sites');
            }, 100);

            tabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-selected', 'true');
                    if (portfolioGrid) {
                        portfolioGrid.setAttribute('aria-labelledby', this.id);
                    }

                    const filter = this.getAttribute('data-filter');
                    applyFilter(filter);
                });
            });
        } else if (portfolioItems.length > 0) {
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (category !== 'sites') {
                    item.style.display = 'none';
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioTabs);
    } else {
        initPortfolioTabs();
        setTimeout(initPortfolioTabs, 100);
    }

    window.addEventListener('load', initPortfolioTabs);
})();

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.btn-submit');
    const statusEl = form.querySelector('#formStatus');
    const action = form.action;

    if (!action || action.includes('YOUR_FORM_ID')) {
        if (statusEl) {
            statusEl.textContent = 'Настройте Formspree: замените YOUR_FORM_ID в action формы.';
            statusEl.className = 'form-status error';
        }
        return;
    }

    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;
    if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
    }

    try {
        const formData = new FormData(form);
        const response = await fetch(action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();

        if (response.ok) {
            btn.textContent = 'Отправлено ✓';
            btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
            if (statusEl) {
                statusEl.textContent = 'Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
                statusEl.className = 'form-status success';
            }
            form.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 4000);
        } else {
            throw new Error(data.error || 'Ошибка отправки');
        }
    } catch (err) {
        btn.textContent = originalText;
        btn.disabled = false;
        if (statusEl) {
            statusEl.textContent = 'Не удалось отправить. Попробуйте позже или напишите на info@goldenpixel.dev';
            statusEl.className = 'form-status error';
        }
    }
}

(function () {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
})();

// Portfolio image slider function
let currentSlide = 0;
function changeSlide(direction) {
    const slider = document.getElementById('caramel-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.portfolio-img');
    if (images.length === 0) return;
    
    images[currentSlide].classList.remove('active');
    
    currentSlide += direction;
    
    if (currentSlide >= images.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = images.length - 1;
    }
    
    images[currentSlide].classList.add('active');
}

// 606 slider function
let currentSlide606 = 0;
function changeSlide606(direction) {
    const slider = document.getElementById('606-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.portfolio-img');
    if (images.length === 0) return;
    
    images[currentSlide606].classList.remove('active');
    
    currentSlide606 += direction;
    
    if (currentSlide606 >= images.length) {
        currentSlide606 = 0;
    } else if (currentSlide606 < 0) {
        currentSlide606 = images.length - 1;
    }
    
    images[currentSlide606].classList.add('active');
}

// Magnum slider function
let currentSlideMagnum = 0;
function changeSlideMagnum(direction) {
    const slider = document.getElementById('magnum-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.portfolio-img');
    if (images.length === 0) return;
    
    images[currentSlideMagnum].classList.remove('active');
    
    currentSlideMagnum += direction;
    
    if (currentSlideMagnum >= images.length) {
        currentSlideMagnum = 0;
    } else if (currentSlideMagnum < 0) {
        currentSlideMagnum = images.length - 1;
    }
    
    images[currentSlideMagnum].classList.add('active');
}

// Magnum gallery modal
function openMagnumGallery() {
    const modal = document.createElement('div');
    modal.className = 'magnum-gallery-modal';
    modal.innerHTML = `
        <div class="magnum-gallery-content">
            <button class="magnum-gallery-close" onclick="closeMagnumGallery()">&times;</button>
            <div class="magnum-gallery-slider">
                <img src="navrouz.jpg" alt="Magnum Poster 1" class="magnum-gallery-img active">
                <img src="navrouz_2.jpg" alt="Magnum Poster 2" class="magnum-gallery-img">
            </div>
            <button class="magnum-gallery-nav prev" onclick="changeGallerySlide(-1)">❮</button>
            <button class="magnum-gallery-nav next" onclick="changeGallerySlide(1)">❯</button>
            <div class="magnum-gallery-dots">
                <span class="dot active" onclick="goToSlide(0)"></span>
                <span class="dot" onclick="goToSlide(1)"></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleGalleryKeydown);
}

function closeMagnumGallery() {
    const modal = document.querySelector('.magnum-gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleGalleryKeydown);
    }
}

let currentGallerySlide = 0;
function changeGallerySlide(direction) {
    const images = document.querySelectorAll('.magnum-gallery-img');
    const dots = document.querySelectorAll('.dot');
    
    if (images.length === 0) return;
    
    images[currentGallerySlide].classList.remove('active');
    dots[currentGallerySlide].classList.remove('active');
    
    currentGallerySlide += direction;
    
    if (currentGallerySlide >= images.length) {
        currentGallerySlide = 0;
    } else if (currentGallerySlide < 0) {
        currentGallerySlide = images.length - 1;
    }
    
    images[currentGallerySlide].classList.add('active');
    dots[currentGallerySlide].classList.add('active');
}

function goToSlide(index) {
    const images = document.querySelectorAll('.magnum-gallery-img');
    const dots = document.querySelectorAll('.dot');
    
    images[currentGallerySlide].classList.remove('active');
    dots[currentGallerySlide].classList.remove('active');
    
    currentGallerySlide = index;
    
    images[currentGallerySlide].classList.add('active');
    dots[currentGallerySlide].classList.add('active');
}

function handleGalleryKeydown(e) {
    if (e.key === 'Escape') {
        closeMagnumGallery();
    } else if (e.key === 'ArrowLeft') {
        changeGallerySlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeGallerySlide(1);
    }
}
