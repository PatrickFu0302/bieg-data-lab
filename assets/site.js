(function () {
    'use strict';

    // Navigation links configuration
    // Label keys correspond to 'nav' section in i18n files
    const links = [
        { id: 'home', href: 'index.html', labelKey: 'home' },
        { id: 'team', href: 'team.html', labelKey: 'team' },
        { id: 'research', href: 'research.html', labelKey: 'research' },
        { id: 'courses', href: 'courses.html', labelKey: 'courses' },
        { id: 'publications', href: 'publications.html', labelKey: 'publications' }
    ];

    const currentLangKey = 'bieg_lab_lang';

    /**
     * Internationalization Manager
     */
    const I18n = {
        lang: localStorage.getItem(currentLangKey) || 'zh', // Default to Chinese
        translations: {},

        /**
         * Load translations for the current language
         */
        async loadTranslations() {
            try {
                const response = await fetch(`assets/i18n/${this.lang}.json`);
                if (!response.ok) throw new Error('Translation file not found');
                this.translations = await response.json();
            } catch (e) {
                console.error('Failed to load translations:', e);
            }
        },

        /**
         * Get translation for a key
         * Supports dot notation e.g. 'home.hero_title'
         */
        t(key) {
            return key.split('.').reduce((obj, i) => (obj ? obj[i] : null), this.translations) || key;
        },

        /**
         * Switch language
         */
        async setLang(lang) {
            this.lang = lang;
            localStorage.setItem(currentLangKey, lang);
            await this.loadTranslations();
            this.updatePageContent();
            this.updateNavContent();
        },

        /**
         * Toggle between EN and ZH
         */
        async toggleLang() {
            const newLang = this.lang === 'zh' ? 'en' : 'zh';
            await this.setLang(newLang);
        },

        /**
         * Update all elements with data-i18n attribute
         */
        updatePageContent() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = this.t(key);
                // Preserve icons if present (simple check)
                if (el.children.length > 0) {
                    // If element has children (like icons), we might need a specific structure
                    // For now, assuming text-only or specific handling
                    // Or finding a text node
                    // Simple approach: look for a span or replace last child text node
                    // Better approach for this site: just replace innerHTML if it's text, or specific targets
                    // Let's assume for now most data-i18n are text containers
                    // If it contains an icon, we might overwrite it.
                    // Strategy: only translated text should be inside the data-i18n element.
                    // If an element has an icon, the text should be wrapped in a span with data-i18n
                    el.innerHTML = text;
                } else {
                    el.innerHTML = text;
                }
            });

            // Update HTML Lang attribute (optional but good for SEO)
            document.documentElement.lang = this.lang === 'zh' ? 'zh-TW' : 'en';
        },

        /**
         * Re-render nav to update specific text
         */
        updateNavContent() {
            renderChrome();
        }
    };

    /**
     * Generate navigation HTML
     * @param {string} active - Active page ID
     * @returns {string} Navigation HTML
     */
    function navTemplate(active = '') {
        // We ensure translations are loaded before this runs ideally, or we run updates after
        const t = (key) => I18n.t(`nav.${key}`);

        const navItems = links.map(link => {
            const isActive = active === link.id ? 'nav-link is-active' : 'nav-link';
            return `<a class="${isActive}" href="${link.href}" data-i18n="nav.${link.labelKey}">${t(link.labelKey)}</a>`;
        }).join('');

        const langBtnLabel = I18n.lang === 'zh' ? 'EN' : '中文';

        return `
            <header class="site-header">
                <div class="shell nav-bar">
                    <a class="brand" href="index.html">
                        <i data-lucide="zap" class="w-5 h-5"></i>
                        <span data-i18n="home.hero_title">${I18n.t('home.hero_title')}</span>
                    </a>
                    <nav class="nav-links">${navItems}</nav>
                    <div class="cta-row flex items-center gap-4">
                         <button id="lang-toggle" class="text-sm font-semibold text-slate-600 hover:text-blue-600 border border-slate-300 rounded px-3 py-1 transition-colors">
                            ${langBtnLabel}
                        </button>
                        <a class="btn btn-primary" href="join.html">
                            <i data-lucide="sparkles" class="w-4 h-4"></i>
                            <span data-i18n="nav.join">${t('join')}</span>
                        </a>
                    </div>
                </div>
            </header>
        `;
    }

    /**
     * Generate footer HTML
     * @returns {string} Footer HTML
     */
    function footerTemplate() {
        // Footer meta text
        const footerMeta = I18n.t('footer.meta');

        return `
            <footer class="site-footer">
                <div class="shell footer-meta">
                    <div class="stat">
                        <i data-lucide="layers" class="w-5 h-5"></i>
                        <strong data-i18n="footer.lab_name">${I18n.t('footer.lab_name')}</strong>
                    </div>
                    <div class="muted" data-i18n="footer.meta">${footerMeta}</div>
                    <div class="footer-links">
                        <a class="footer-link" href="mailto:chunfu@ntu.edu.tw">
                            <i data-lucide="mail" class="w-4 h-4"></i>Email
                        </a>
                        <a class="footer-link" href="https://linkedin.com/in/chun-fu" target="_blank" rel="noreferrer">
                            <i data-lucide="linkedin" class="w-4 h-4"></i>LinkedIn
                        </a>
                    </div>
                </div>
            </footer>
        `;
    }

    /**
     * Render navigation and footer components
     */
    function renderChrome() {
        // Render navigation
        document.querySelectorAll('[data-site-nav]').forEach(node => {
            const active = node.getAttribute('data-active-page') || '';
            node.innerHTML = navTemplate(active);
        });

        // Render footer
        document.querySelectorAll('[data-site-footer]').forEach(node => {
            node.innerHTML = footerTemplate();
        });

        // Re-bind Lang Toggle Event
        const langBtn = document.getElementById('lang-toggle');
        if (langBtn) {
            langBtn.onclick = async () => {
                await I18n.toggleLang();
            };
        }

        // Re-init icons since we rewrote HTML
        initIcons();
    }

    /**
     * Initialize Lucide icons
     */
    function initIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        } else {
            console.warn('Lucide icons library not loaded');
        }
    }

    /**
     * Add smooth scroll behavior for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Add intersection observer for fade-in animations
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe cards and sections
        document.querySelectorAll('.card, section').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Main initialization function
     */
    async function init() {
        await I18n.loadTranslations();
        renderChrome();
        I18n.updatePageContent(); // Translates static page content

        initIcons();
        initSmoothScroll();

        // Initialize scroll animations after a short delay
        setTimeout(() => {
            initScrollAnimations();
        }, 100);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // PI Show More Toggle Logic
    document.addEventListener('DOMContentLoaded', () => {
        const showMoreBtn = document.getElementById('pi-show-more-btn');
        const showLessBtn = document.getElementById('pi-show-less-btn');
        const wrapper = document.getElementById('pi-details-wrapper');
        const details = document.getElementById('pi-details');

        if (showMoreBtn && showLessBtn && wrapper && details) {
            // Show More
            showMoreBtn.addEventListener('click', () => {
                wrapper.classList.remove('grid-rows-[0fr]');
                wrapper.classList.add('grid-rows-[1fr]');
                details.classList.remove('opacity-0');

                // Hide show more button
                showMoreBtn.classList.add('hidden');
            });

            // Show Less
            showLessBtn.addEventListener('click', () => {
                wrapper.classList.remove('grid-rows-[1fr]');
                wrapper.classList.add('grid-rows-[0fr]');
                details.classList.add('opacity-0');

                // Show show more button again
                showMoreBtn.classList.remove('hidden');

                // Optional: Scroll back to top button if needed
                // showMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
        // Carousel Infinite Scroll Setup
        const track = document.getElementById('collaborators-track');
        if (track) {
            // Duplicate content for seamless scrolling
            track.innerHTML += track.innerHTML;
        }

        // Partners Carousel Logic
        const partnersTrack = document.getElementById('partners-carousel-track');
        const partnersPrev = document.getElementById('partners-prev');
        const partnersNext = document.getElementById('partners-next');
        const partnersDots = document.getElementById('partners-dots');

        if (partnersTrack && partnersPrev && partnersNext && partnersDots) {
            let currentIndex = 0;
            const cards = partnersTrack.children;
            const totalCards = cards.length;
            let cardsPerView = window.innerWidth >= 768 ? 2 : 1;
            let maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
            let autoPlayInterval;

            // Initialize Dots
            function initDots() {
                partnersDots.innerHTML = '';
                const numDots = Math.ceil(totalCards / cardsPerView);
                for (let i = 0; i < numDots; i++) {
                    const dot = document.createElement('button');
                    dot.className = `w-2 h-2 rounded-full transition-all ${i === 0 ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-blue-400'}`;
                    dot.addEventListener('click', () => goToSlide(i));
                    partnersDots.appendChild(dot);
                }
            }

            // Update Carousel Position
            function updateCarousel() {
                const percentage = -(currentIndex * 100);
                partnersTrack.style.transform = `translateX(${percentage}%)`;

                // Update Dots
                const dots = partnersDots.children;
                for (let i = 0; i < dots.length; i++) {
                    dots[i].className = `w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-blue-400'}`;
                }
            }

            // Go to specific slide
            function goToSlide(index) {
                currentIndex = index;
                if (currentIndex < 0) currentIndex = maxIndex;
                if (currentIndex > maxIndex) currentIndex = 0;
                updateCarousel();
                resetAutoPlay();
            }

            // Next Slide
            function nextSlide() {
                goToSlide(currentIndex + 1);
            }

            // Prev Slide
            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            // Auto Play
            function startAutoPlay() {
                autoPlayInterval = setInterval(nextSlide, 5000);
            }

            function resetAutoPlay() {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }

            // Event Listeners
            partnersNext.addEventListener('click', nextSlide);
            partnersPrev.addEventListener('click', prevSlide);

            // Responsive Handling
            window.addEventListener('resize', () => {
                const newCardsPerView = window.innerWidth >= 768 ? 2 : 1;
                if (newCardsPerView !== cardsPerView) {
                    cardsPerView = newCardsPerView;
                    maxIndex = Math.ceil(totalCards / cardsPerView) - 1;
                    currentIndex = 0; // Reset to start to avoid layout issues
                    initDots();
                    updateCarousel();
                }
            });

            // Initialize
            initDots();
            startAutoPlay();
        }
    });
})();
