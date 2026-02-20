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
