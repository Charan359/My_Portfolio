// ===== CHARAN HS — Premium Portfolio Script =====

document.addEventListener('DOMContentLoaded', () => {

    // ========================================
    // 1. PRELOADER
    // ========================================
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');
    let progress = 0;

    function animateCounter() {
        const increment = Math.random() * 8 + 2;
        progress = Math.min(progress + increment, 100);
        counterEl.textContent = Math.floor(progress);

        if (progress < 100) {
            setTimeout(animateCounter, 60 + Math.random() * 80);
        } else {
            counterEl.textContent = '100';
            setTimeout(() => {
                preloader.classList.add('is-done');
                document.body.classList.add('is-loaded');
            }, 400);
        }
    }

    // Start counter after letters animate in
    setTimeout(animateCounter, 600);


    // ========================================
    // 2. CUSTOM CURSOR
    // ========================================
    const cursor = document.getElementById('cursor');
    if (cursor && window.innerWidth > 768) {
        let cursorX = 0, cursorY = 0;
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        function updateCursor() {
            cursorX += (targetX - cursorX) * 0.12;
            cursorY += (targetY - cursorY) * 0.12;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(updateCursor);
        }
        updateCursor();

        // Hover detection for interactive elements
        const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], .hero__ticker-item, .hero__portrait-wrapper');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
        });
    }


    // ========================================
    // 3. MAGNETIC BUTTON EFFECT
    // ========================================
    const magneticEls = document.querySelectorAll('[data-magnetic]');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = 0.3;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => { el.style.transition = ''; }, 500);
        });
    });


    // ========================================
    // 4. PARALLAX WATERMARK
    // ========================================
    const watermark = document.getElementById('watermark');
    if (watermark) {
        document.addEventListener('mousemove', (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
            watermark.style.transform = `translate(calc(-50% + ${xPercent * 20}px), calc(-50% + ${yPercent * 12}px))`;
        });
    }


    // ========================================
    // 5. PORTRAIT 3D TILT EFFECT
    // ========================================
    const portraitWrapper = document.getElementById('hero-portrait-wrapper');
    if (portraitWrapper) {
        portraitWrapper.addEventListener('mousemove', (e) => {
            const rect = portraitWrapper.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 8;
            const tiltY = (x - 0.5) * -8;

            portraitWrapper.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        portraitWrapper.addEventListener('mouseleave', () => {
            portraitWrapper.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            portraitWrapper.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
            setTimeout(() => { portraitWrapper.style.transition = ''; }, 600);
        });
    }


    // ========================================
    // 6. TICKER DRAG SCROLL
    // ========================================
    const ticker = document.getElementById('ticker');
    if (ticker) {
        let isDown = false;
        let startX;
        let scrollLeft;

        ticker.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - ticker.offsetLeft;
            scrollLeft = ticker.scrollLeft;
        });

        ticker.addEventListener('mouseleave', () => { isDown = false; });
        ticker.addEventListener('mouseup', () => { isDown = false; });

        ticker.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - ticker.offsetLeft;
            const walk = (x - startX) * 1.5;
            ticker.scrollLeft = scrollLeft - walk;
        });
    }


    // ========================================
    // 7. STAGGERED TICKER ITEMS
    // ========================================
    const tickerItems = document.querySelectorAll('.hero__ticker-item');
    tickerItems.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
        el.style.transition = `opacity 0.6s ${3.8 + i * 0.12}s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s ${3.8 + i * 0.12}s cubic-bezier(0.16, 1, 0.3, 1)`;
        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });


    // ========================================
    // 8. TEXT HOVER — LETTER SPACING
    // ========================================
    const nameWords = document.querySelectorAll('.hero__name-word');
    nameWords.forEach(word => {
        word.addEventListener('mouseenter', () => {
            word.style.transition = 'letter-spacing 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease';
            word.style.letterSpacing = '0.04em';
        });
        word.addEventListener('mouseleave', () => {
            word.style.letterSpacing = '-0.03em';
        });
    });


    // ========================================
    // 9. SMOOTH SCROLL INDICATOR CLICK
    // ========================================
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        });
        scrollIndicator.style.cursor = 'none';
    }


    // ========================================
    // 10. NAV MENU ANIMATION
    // ========================================
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        let isOpen = false;
        menuBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            const spans = menuBtn.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(2px, 2px)';
                spans[1].style.transform = 'rotate(-45deg) translate(2px, -2px)';
                spans[0].style.width = '18px';
                spans[1].style.width = '18px';
            } else {
                spans[0].style.transform = '';
                spans[1].style.transform = '';
                spans[0].style.width = '';
                spans[1].style.width = '';
            }
        });
    }


    // ========================================
    // 11. INTERSECTION OBSERVER FOR REVEALS
    // ========================================
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealEls.forEach(el => observer.observe(el));
    }


    // ========================================
    // 12. KEYBOARD NAVIGATION
    // ========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            document.getElementById('prev-btn')?.click();
        } else if (e.key === 'ArrowRight') {
            document.getElementById('next-btn')?.click();
        }
    });

});
