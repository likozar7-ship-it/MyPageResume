const observerOptions = {
    root: null,
    rootMargin: '0px 0px -90px 0px',
    threshold: 0.12
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        const delay = Math.min(index * 70, 420);
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

    const words = ['Asesor Inmobiliario', 'Cocinero', 'Operario de Producción', 'Profesional Polivalente'];
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

        const speed = isDeleting ? 60 : 90;
        setTimeout(type, speed);
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
            const headerOffset = 90;
            const top = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;

            window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            closeMobileMenu();
        });
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('active');
        document.body.classList.toggle('menu-open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    const menu = document.getElementById('nav-menu');
    const toggle = document.getElementById('nav-toggle');
    if (!menu || !toggle) return;
    menu.classList.remove('active');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
}

function initBackToTop() {
    const button = document.querySelector('.back-to-top');
    if (!button) return;

    const toggleButton = () => {
        button.classList.toggle('visible', window.scrollY > 560);
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
            const duration = 1100;
            const startTime = performance.now();
            const from = 0;

            const step = (timestamp) => {
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                counter.textContent = String(value);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = String(target);
                }
            };

            requestAnimationFrame(step);
            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.6 });

    counters.forEach((counter) => counterObserver.observe(counter));
}

function initCustomCursor() {
    if (prefersReducedMotion) return;

    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;

    window.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        follower.style.left = `${event.clientX}px`;
        follower.style.top = `${event.clientY}px`;
    });

    document.querySelectorAll('a, button, .timeline-card, .education-card, .language-card, .skill-chip').forEach((element) => {
        element.addEventListener('mouseenter', () => {
            follower.style.width = '56px';
            follower.style.height = '56px';
            follower.style.borderColor = 'rgba(242, 209, 109, 0.6)';
            follower.style.backgroundColor = 'rgba(242, 209, 109, 0.08)';
        });
        element.addEventListener('mouseleave', () => {
            follower.style.width = '36px';
            follower.style.height = '36px';
            follower.style.borderColor = 'rgba(242, 209, 109, 0.32)';
            follower.style.backgroundColor = 'transparent';
        });
    });
}

function initHeroBackground() {
    const heroBg = document.getElementById('hero-bg');
    if (!heroBg) return;

    const count = 6;
    for (let index = 0; index < count; index += 1) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        orb.style.width = `${60 + index * 18}px`;
        orb.style.height = `${60 + index * 18}px`;
        orb.style.left = `${8 + index * 11}%`;
        orb.style.top = `${12 + (index % 3) * 18}%`;
        orb.style.opacity = `${0.16 + index * 0.03}`;
        heroBg.appendChild(orb);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initHeroBackground();
    initRevealOnScroll();
    initSkillBars();
    initTypingEffect();
    initSmoothScroll();
    initMobileMenu();
    initBackToTop();
    initStatsCounter();
    initCustomCursor();
});
