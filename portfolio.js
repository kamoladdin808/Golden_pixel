(function () {
    const navbar = document.getElementById('navbar');
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.scrollY;

                navbar.classList.toggle('scrolled', scrolled > 60);

                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

(function () {
    function makeElementsVisible() {
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }

    makeElementsVisible();
    setTimeout(makeElementsVisible, 50);
    window.addEventListener('load', makeElementsVisible);
})();

function toggleMenu(open) {
    const burger = document.getElementById('burger');
    const menu = document.getElementById('mobileMenu');
    const isActive = open !== undefined ? open : burger.classList.toggle('active');
    burger.classList.toggle('active', isActive);
    menu.classList.toggle('active', isActive);
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

(function () {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
})();

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

// Rosemary slider function
let currentSlideRosemary = 0;
function changeSlideRosemary(direction) {
    const slider = document.getElementById('rosemary-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.portfolio-img');
    if (images.length === 0) return;
    
    images[currentSlideRosemary].classList.remove('active');
    
    currentSlideRosemary += direction;
    
    if (currentSlideRosemary >= images.length) {
        currentSlideRosemary = 0;
    } else if (currentSlideRosemary < 0) {
        currentSlideRosemary = images.length - 1;
    }
    
    images[currentSlideRosemary].classList.add('active');
}

// Rosemary gallery modal
function openRosemaryGallery() {
    const modal = document.createElement('div');
    modal.className = 'magnum-gallery-modal';
    modal.innerHTML = `
        <div class="magnum-gallery-content">
            <button class="magnum-gallery-close" onclick="closeRosemaryGallery()">&times;</button>
            <div class="magnum-gallery-slider">
                <img src="rosemary_1.jpg" alt="Rosemary Restaurant 1" class="magnum-gallery-img active">
                <img src="rosemary.jpg" alt="Rosemary Restaurant 2" class="magnum-gallery-img">
            </div>
            <button class="magnum-gallery-nav prev" onclick="changeRosemaryGallerySlide(-1)">❮</button>
            <button class="magnum-gallery-nav next" onclick="changeRosemaryGallerySlide(1)">❯</button>
            <div class="magnum-gallery-dots">
                <span class="dot active" onclick="goToRosemarySlide(0)"></span>
                <span class="dot" onclick="goToRosemarySlide(1)"></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleRosemaryGalleryKeydown);
}

function closeRosemaryGallery() {
    const modal = document.querySelector('.magnum-gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleRosemaryGalleryKeydown);
    }
}

let currentRosemaryGallerySlide = 0;
function changeRosemaryGallerySlide(direction) {
    const images = document.querySelectorAll('.magnum-gallery-img');
    const dots = document.querySelectorAll('.dot');
    
    if (images.length === 0) return;
    
    images[currentRosemaryGallerySlide].classList.remove('active');
    dots[currentRosemaryGallerySlide].classList.remove('active');
    
    currentRosemaryGallerySlide += direction;
    
    if (currentRosemaryGallerySlide >= images.length) {
        currentRosemaryGallerySlide = 0;
    } else if (currentRosemaryGallerySlide < 0) {
        currentRosemaryGallerySlide = images.length - 1;
    }
    
    images[currentRosemaryGallerySlide].classList.add('active');
    dots[currentRosemaryGallerySlide].classList.add('active');
}

function goToRosemarySlide(index) {
    const images = document.querySelectorAll('.magnum-gallery-img');
    const dots = document.querySelectorAll('.dot');
    
    images[currentRosemaryGallerySlide].classList.remove('active');
    dots[currentRosemaryGallerySlide].classList.remove('active');
    
    currentRosemaryGallerySlide = index;
    
    images[currentRosemaryGallerySlide].classList.add('active');
    dots[currentRosemaryGallerySlide].classList.add('active');
}

function handleRosemaryGalleryKeydown(e) {
    if (e.key === 'Escape') {
        closeRosemaryGallery();
    } else if (e.key === 'ArrowLeft') {
        changeRosemaryGallerySlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeRosemaryGallerySlide(1);
    }
}

// Alumin slider function
let currentSlideAlumin = 0;
function changeSlideAlumin(direction) {
    const slider = document.getElementById('alumin-slider');
    if (!slider) return;
    
    const images = slider.querySelectorAll('.portfolio-img');
    if (images.length === 0) return;
    
    images[currentSlideAlumin].classList.remove('active');
    
    currentSlideAlumin += direction;
    
    if (currentSlideAlumin >= images.length) {
        currentSlideAlumin = 0;
    } else if (currentSlideAlumin < 0) {
        currentSlideAlumin = images.length - 1;
    }
    
    images[currentSlideAlumin].classList.add('active');
}

// Alumin gallery modal
function openAluminGallery() {
    const modal = document.createElement('div');
    modal.className = 'magnum-gallery-modal';
    modal.innerHTML = `
        <div class="magnum-gallery-content">
            <button class="magnum-gallery-close" onclick="closeAluminGallery()">&times;</button>
            <div class="magnum-gallery-slider">
                <img src="alumin.jpg" alt="Xinjiang Xingu Aluminum 1" class="magnum-gallery-img active">
                <img src="alumin_2.jpg" alt="Xinjiang Xingu Aluminum 2" class="magnum-gallery-img">
                <img src="alumin_3.jpg" alt="Xinjiang Xingu Aluminum 3" class="magnum-gallery-img">
            </div>
            <button class="magnum-gallery-nav prev" onclick="changeAluminGallerySlide(-1)">❮</button>
            <button class="magnum-gallery-nav next" onclick="changeAluminGallerySlide(1)">❯</button>
            <div class="magnum-gallery-dots">
                <span class="dot active" onclick="goToAluminSlide(0)"></span>
                <span class="dot" onclick="goToAluminSlide(1)"></span>
                <span class="dot" onclick="goToAluminSlide(2)"></span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleAluminGalleryKeydown);
}

function closeAluminGallery() {
    const modal = document.querySelector('.magnum-gallery-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleAluminGalleryKeydown);
    }
}

let currentAluminGallerySlide = 0;
function changeAluminGallerySlide(direction) {
    const images = document.querySelectorAll('.magnum-gallery-img');
    const dots = document.querySelectorAll('.dot');
    
    if (images.length === 0) return;
    
    images[currentAluminGallerySlide].classList.remove('active');
    dots[currentAluminGallerySlide].classList.remove('active');
    
    currentAluminGallerySlide += direction;
    
    if (currentAluminGallerySlide >= images.length) {
        currentAluminGallerySlide = 0;
    } else if (currentAluminGallerySlide < 0) {
        currentAluminGallerySlide = images.length - 1;
    }
    
    images[currentAluminGallerySlide].classList.add('active');
    dots[currentAluminGallerySlide].classList.add('active');
}

function goToAluminSlide(index) {
    const images = document.querySelectorAll('.magnum-gallery-img');
    const dots = document.querySelectorAll('.dot');
    
    images[currentAluminGallerySlide].classList.remove('active');
    dots[currentAluminGallerySlide].classList.remove('active');
    
    currentAluminGallerySlide = index;
    
    images[currentAluminGallerySlide].classList.add('active');
    dots[currentAluminGallerySlide].classList.add('active');
}

function handleAluminGalleryKeydown(e) {
    if (e.key === 'Escape') {
        closeAluminGallery();
    } else if (e.key === 'ArrowLeft') {
        changeAluminGallerySlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeAluminGallerySlide(1);
    }
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
