(function () {
    'use strict';

    // Navigation links configuration
    const links = [
        { id: 'home', href: 'index.html', label: '首頁' },
        { id: 'research', href: 'research.html', label: '研究計畫' },
        { id: 'pi', href: 'pi.html', label: '主持人' },
        { id: 'publications', href: 'publications.html', label: '論文發表' }
    ];

    // Footer metadata
    const footerMeta = '© 2025 BIEG Data Lab | 國立台灣大學 生物環境系統工程學系';

    /**
     * Generate navigation HTML
     * @param {string} active - Active page ID
     * @returns {string} Navigation HTML
     */
    function navTemplate(active = '') {
        const navItems = links.map(link => {
            const isActive = active === link.id ? 'nav-link is-active' : 'nav-link';
            return `<a class="${isActive}" href="${link.href}">${link.label}</a>`;
        }).join('');

        return `
            <header class="site-header">
                <div class="shell nav-bar">
                    <a class="brand" href="index.html">
                        <i data-lucide="zap" class="w-5 h-5"></i>
                        BIEG Data Lab
                    </a>
                    <nav class="nav-links">${navItems}</nav>
                    <div class="cta-row">
                        <a class="btn btn-primary" href="join.html">
                            <i data-lucide="sparkles" class="w-4 h-4"></i>
                            加入我們
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
        return `
            <footer class="site-footer">
                <div class="shell footer-meta">
                    <div class="stat">
                        <i data-lucide="layers" class="w-5 h-5"></i>
                        <strong>BIEG Data Lab</strong>
                    </div>
                    <div class="muted">${footerMeta}</div>
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
    function init() {
        renderChrome();
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
})();
