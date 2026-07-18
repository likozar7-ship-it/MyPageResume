const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.12
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sectionIds = ['hero', 'about', 'experience', 'education', 'skills', 'languages', 'contact'];

function initRevealOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach((element, index) => {
        const delay = Math.min(index * 50, 350);
        element.style.setProperty('--reveal-delay', `${delay}ms`);
        observer.observe(element);
    });
}

function initSkillBars() {
    const bars = document.querySelectorAll('.lang-fill');
    if (!bars.length) return;

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const level = bar.getAttribute('data-level') || '0';
            bar.style.width = `${level}%`;
            barObserver.unobserve(bar);
        });
    }, { threshold: 0.5 });

    bars.forEach((bar) => barObserver.observe(bar));
}

function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement || prefersReducedMotion) return;

    const words = ['Asesor Inmobiliario', 'Cocinero', 'Operario de Producción', 'Auxiliar de Empaquetado'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentWord = words[wordIndex];
        typingElement.textContent = isDeleting
            ? currentWord.substring(0, charIndex - 1)
            : currentWord.substring(0, charIndex + 1);

        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => {
                isDeleting = true;
                type();
            }, 1400);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, isDeleting ? 60 : 90);
    };

    type();
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            event.preventDefault();
            const headerOffset = window.innerWidth <= 960 ? 72 : 24;
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            closeSidebar();
        });
    });
}

function initSidebarMenu() {
    const toggle = document.getElementById('nav-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');
    const menu = document.getElementById('sidebar-nav');

    if (!toggle || !menu) return;

    const openSidebar = () => {
        document.body.classList.add('sidebar-open');
        toggle.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.hidden = false;
    };

    const close = () => closeSidebar();

    toggle.addEventListener('click', () => {
        if (document.body.classList.contains('sidebar-open')) {
            close();
        } else {
            openSidebar();
        }
    });

    if (backdrop) backdrop.addEventListener('click', close);

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close();
    });
}

function closeSidebar() {
    const toggle = document.getElementById('nav-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');

    document.body.classList.remove('sidebar-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (backdrop) backdrop.hidden = true;
}

function initActiveSection() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (!navLinks.length || !sections.length) return;

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) setActiveLink(visible[0].target.id);
    }, {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5]
    });

    sections.forEach((section) => observer.observe(section));
}

function initBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    const toggleButton = () => {
        button.classList.toggle('visible', window.scrollY > 480);
    };

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', toggleButton, { passive: true });
    toggleButton();
}

function initStatsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = Number(counter.getAttribute('data-count') || '0');
            const duration = 1000;
            const startTime = performance.now();

            const step = (timestamp) => {
                const progress = Math.min((timestamp - startTime) / duration, 1);
                counter.textContent = String(Math.floor(progress * target));
                if (progress < 1) requestAnimationFrame(step);
                else counter.textContent = String(target);
            };

            requestAnimationFrame(step);
            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.6 });

    counters.forEach((counter) => counterObserver.observe(counter));
}

function prepareForPrint() {
    document.querySelectorAll('.fade-in').forEach((el) => el.classList.add('visible'));

    document.querySelectorAll('.lang-fill').forEach((bar) => {
        const level = bar.getAttribute('data-level') || '100';
        bar.style.width = `${level}%`;
    });

    document.querySelectorAll('.stat-number').forEach((counter) => {
        counter.textContent = counter.getAttribute('data-count') || counter.textContent;
    });
}

function fitCvToOnePage() {
    const shell = document.getElementById('cv-print-shell');
    const cv = document.getElementById('cv-print');
    if (!cv) return;

    cv.style.transform = '';
    cv.style.zoom = '';
    cv.style.width = '';
    cv.style.height = '';

    if (shell) {
        shell.style.height = '';
        shell.style.overflow = 'hidden';
    }

    const mmToPx = 96 / 25.4;
    const pageHeightPx = (297 - 10) * mmToPx;
    const contentHeight = cv.scrollHeight;

    if (contentHeight > pageHeightPx) {
        const scale = pageHeightPx / contentHeight;
        cv.style.transform = `scale(${scale})`;
        cv.style.transformOrigin = 'top left';
        cv.style.width = `${100 / scale}%`;

        if ('zoom' in cv.style) {
            cv.style.zoom = String(scale);
        }
    }

    if (shell) {
        shell.style.height = `${pageHeightPx}px`;
    }
}

function resetPrintState() {
    document.body.classList.remove('is-printing-cv');

    const shell = document.getElementById('cv-print-shell');
    const cv = document.getElementById('cv-print');

    if (cv) {
        cv.style.transform = '';
        cv.style.zoom = '';
        cv.style.width = '';
        cv.style.height = '';
    }

    if (shell) {
        shell.style.height = '';
        shell.style.overflow = '';
    }
}

function initCvDownload() {
    document.querySelectorAll('.btn-download-cv').forEach((button) => {
        button.addEventListener('click', () => {
            prepareForPrint();
            document.body.classList.add('is-printing-cv');

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fitCvToOnePage();
                    window.print();
                });
            });
        });
    });

    window.addEventListener('afterprint', resetPrintState);
}

function initJobCards() {
    const cards = document.querySelectorAll('.job-card');
    const prefersHover = window.matchMedia('(hover: hover)').matches;

    const setExpanded = (card, expanded) => {
        card.classList.toggle('is-expanded', expanded);
        const toggle = card.querySelector('.job-toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', String(expanded));
            const label = toggle.querySelector('.job-toggle-label');
            if (label) label.textContent = expanded ? 'Ocultar tareas' : 'Ver tareas';
        }
    };

    const closeOthers = (current) => {
        cards.forEach((card) => {
            if (card !== current) setExpanded(card, false);
        });
    };

    cards.forEach((card) => {
        const toggle = card.querySelector('.job-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const willExpand = !card.classList.contains('is-expanded');
            if (willExpand) closeOthers(card);
            setExpanded(card, willExpand);
        });

        if (!prefersHover) {
            card.addEventListener('click', (event) => {
                if (event.target.closest('.job-toggle')) return;
                const willExpand = !card.classList.contains('is-expanded');
                if (willExpand) closeOthers(card);
                setExpanded(card, willExpand);
            });
        }
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.job-card')) {
            cards.forEach((card) => setExpanded(card, false));
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            cards.forEach((card) => setExpanded(card, false));
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRevealOnScroll();
    initSkillBars();
    initTypingEffect();
    initSmoothScroll();
    initSidebarMenu();
    initActiveSection();
    initBackToTop();
    initStatsCounter();
    initCvDownload();
    initJobCards();
});
