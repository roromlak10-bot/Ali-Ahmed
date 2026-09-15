/* ==========================================================
   Ali Ahmed | Portfolio Script v2.0 (Advanced)
   Features: Modular, Performance-Optimized, Error-Safe
   ========================================================== */

'use strict';

/* ==========================================================
   CORE UTILITIES
   ========================================================== */
const App = {
    // Safe element selector
    $: (selector, parent = document) => parent.querySelector(selector),
    $$: (selector, parent = document) => [...parent.querySelectorAll(selector)],

    // Safe event binding
    on: (el, event, handler) => {
        if (el && typeof el.addEventListener === 'function') {
            el.addEventListener(event, handler);
        }
    },

    // Debounce (performance)
    debounce: (fn, delay = 100) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), delay);
        };
    },

    // Throttle (scroll performance)
    throttle: (fn, limit = 100) => {
        let waiting = false;
        return (...args) => {
            if (!waiting) {
                fn(...args);
                waiting = true;
                setTimeout(() => waiting = false, limit);
            }
        };
    },

    // Local storage helpers
    storage: {
        get: (key, fallback = null) => {
            try { return localStorage.getItem(key) ?? fallback; }
            catch { return fallback; }
        },
        set: (key, value) => {
            try { localStorage.setItem(key, value); }
            catch { /* silent */ }
        }
    },

    // Prefers reduced motion
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    // Is mobile
    isMobile: () => window.innerWidth <= 768
};

/* ==========================================================
   1. LOADER
   ========================================================== */
const Loader = {
    init() {
        const loader = App.$('#loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('hide');
                document.body.classList.add('loaded');
                setTimeout(() => {
                    loader.style.display = 'none';
                    Loader.runAnimations();
                }, 600);
            }, 800);
        });
    },

    runAnimations() {
        // Delayed hero animations
        const hero = App.$('.home-content');
        if (hero) hero.classList.add('animate-in');
    }
};

/* ==========================================================
   2. MOBILE MENU
   ========================================================== */
const MobileMenu = {
    init() {
        const menuIcon = App.$('#menuIcon');
        const navbar = App.$('#navbar');
        if (!menuIcon || !navbar) return;

        App.on(menuIcon, 'click', () => {
            menuIcon.classList.toggle('fa-xmark');
            menuIcon.classList.toggle('fa-bars');
            navbar.classList.toggle('active');
        });

        App.$$('.nav-link').forEach(link => {
            App.on(link, 'click', () => {
                navbar.classList.remove('active');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            });
        });

        // Close on outside click
        App.on(document, 'click', (e) => {
            if (navbar.classList.contains('active') &&
                !navbar.contains(e.target) &&
                !menuIcon.contains(e.target)) {
                navbar.classList.remove('active');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
        });
    }
};

/* ==========================================================
   3. TYPING EFFECT (Advanced)
   ========================================================== */
const Typing = {
    words: [
        'Web Developer',
        'Frontend Developer',
        'JavaScript Lover',
        'Problem Solver',
        'UI Enthusiast',
        'React Learner'
    ],
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    element: null,

    init() {
        this.element = App.$('.typing');
        if (!this.element) return;
        if (App.reducedMotion) {
            this.element.textContent = this.words[0];
            return;
        }
        this.type();
    },

    type() {
        const currentWord = this.words[this.wordIndex];
        this.element.textContent = currentWord.substring(0, this.charIndex);

        let delay = 100;
        if (this.isDeleting) delay = 50;

        if (!this.isDeleting && this.charIndex < currentWord.length) {
            this.charIndex++;
        } else if (this.isDeleting && this.charIndex > 0) {
            this.charIndex--;
        } else if (!this.isDeleting) {
            this.isDeleting = true;
            delay = 1500;
        } else {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            delay = 300;
        }

        setTimeout(() => this.type(), delay);
    }
};

/* ==========================================================
   4. THEME MANAGER
   ========================================================== */
const Theme = {
    init() {
        const toggle = App.$('#themeToggle');
        const icon = toggle ? App.$('i', toggle) : null;
        if (!toggle || !icon) return;

        const saved = App.storage.get('theme', 'dark');
        if (saved === 'light') this.applyLight(icon);

        App.on(toggle, 'click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');

            if (isLight) {
                this.applyLight(icon);
                App.storage.set('theme', 'light');
            } else {
                this.applyDark(icon);
                App.storage.set('theme', 'dark');
            }

            // Dispatch event for other modules
            window.dispatchEvent(new CustomEvent('themechange', {
                detail: { theme: isLight ? 'light' : 'dark' }
            }));
        });
    },

    applyLight(icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    },

    applyDark(icon) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
};

/* ==========================================================
   5. SCROLL MANAGER
   ========================================================== */
const ScrollManager = {
    init() {
        this.progressBar = App.$('#progressBar');
        this.backToTop = App.$('#backToTop');
        this.header = App.$('#header');
        this.sections = App.$$('section');
        this.navLinks = App.$$('.nav-link');
        this.indicatorDots = App.$$('.scroll-indicator .dot');
        this.ringProgress = App.$('#ringProgress');

        this.setupRing();

        App.on(window, 'scroll', App.throttle(() => this.handle(), 16));
        this.handle();
    },

    setupRing() {
        if (!this.ringProgress) return;
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        this.ringProgress.style.strokeDasharray = circumference;
        this.ringProgress.style.strokeDashoffset = circumference;
        this.ringCirc = circumference;
    },

    handle() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) : 0;

        // Progress bar
        if (this.progressBar) this.progressBar.style.width = (percent * 100) + '%';

        // Scroll ring
        if (this.ringProgress && this.ringCirc) {
            this.ringProgress.style.strokeDashoffset =
                this.ringCirc - (percent * this.ringCirc);
        }

        // Header shadow
        if (this.header) this.header.classList.toggle('scrolled', scrollTop > 50);

        // Back to top
        if (this.backToTop) this.backToTop.classList.toggle('show', scrollTop > 400);

        // Active nav link
        let current = '';
        this.sections.forEach(section => {
            if (scrollTop >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });

        // Scroll indicator dots
        this.indicatorDots.forEach(dot => {
            dot.classList.toggle('active', dot.dataset.section === current);
        });
    }
};

/* ==========================================================
   6. SMOOTH SCROLL
   ========================================================== */
const SmoothScroll = {
    init() {
        App.$$('a[href^="#"]').forEach(anchor => {
            App.on(anchor, 'click', (e) => {
                const id = anchor.getAttribute('href');
                if (!id || id === '#') return;

                const target = App.$(id);
                if (!target) return;

                e.preventDefault();
                const offset = 80;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: App.reducedMotion ? 'auto' : 'smooth'
                });
            });
        });
    }
};

/* ==========================================================
   7. REVEAL OBSERVER (Advanced)
   ========================================================== */
const Reveal = {
    selectors: [
        '.stat', '.info-item', '.about-info li',
        '.service-box', '.project-box', '.skill-box',
        '.timeline-item', '.edu-card', '.cert-card',
        '.testimonial-box', '.blog-card', '.pricing-card',
        '.counter-box', '.tech-item', '.contact-card',
        '.milestone', '.partner', '.process-step',
        '.award-card', '.team-member', '.stat-card',
        '.radar-item', '.contact-info', '.cta-banner-content',
        '.gallery-item', '.faq-item', '.availability-content'
    ],

    init() {
        if (App.reducedMotion) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        App.$$(this.selectors.join(',')).forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(25px)';
            el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`;
            observer.observe(el);
        });
    }
};

/* ==========================================================
   8. SKILL BARS
   ========================================================== */
const SkillBars = {
    init() {
        const section = App.$('.skills');
        if (!section) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    App.$$('.skill-bar span', entry.target).forEach((bar, i) => {
                        setTimeout(() => {
                            bar.style.width = bar.dataset.width;
                        }, i * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    }
};

/* ==========================================================
   9. PROJECT FILTERS (Advanced)
   ========================================================== */
const ProjectFilters = {
    init() {
        const buttons = App.$$('.filter-btn');
        const boxes = App.$$('.project-box');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            App.on(btn, 'click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                let visibleCount = 0;

                boxes.forEach((box, i) => {
                    const match = filter === 'all' || box.dataset.category === filter;

                    if (match) {
                        box.classList.remove('hide');
                        box.style.animation = 'none';
                        void box.offsetWidth;
                        box.style.animation = `fadeUp 0.5s ease ${visibleCount * 0.05}s forwards`;
                        visibleCount++;
                    } else {
                        box.classList.add('hide');
                    }
                });
            });
        });
    }
};

/* ==========================================================
   10. TOAST NOTIFICATIONS (Smart)
   ========================================================== */
const Toast = {
    queue: [],
    showing: false,

    show(message, type = 'success', duration = 3000) {
        this.queue.push({ message, type, duration });
        if (!this.showing) this.process();
    },

    process() {
        if (!this.queue.length) {
            this.showing = false;
            return;
        }

        this.showing = true;
        const { message, type, duration } = this.queue.shift();
        const toast = App.$('#toast');
        const msgEl = App.$('#toastMessage');
        if (!toast || !msgEl) {
            this.showing = false;
            return;
        }

        msgEl.textContent = message;

        // Icon by type
        const icon = App.$('i', toast);
        if (icon) {
            icon.className = type === 'error'
                ? 'fa-solid fa-circle-exclamation'
                : type === 'warning'
                    ? 'fa-solid fa-triangle-exclamation'
                    : 'fa-solid fa-circle-check';
        }

        toast.className = `toast toast-${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => this.process(), 400);
        }, duration);
    }
};

/* ==========================================================
   11. CONTACT FORM (Advanced)
   ========================================================== */
const ContactForm = {
    init() {
        const form = App.$('#contactForm');
        if (!form) return;

        App.on(form, 'submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;

            // Validate
            const data = new FormData(form);
            const email = data.get('email') || form.querySelector('input[type="email"]').value;

            if (!this.isValidEmail(email)) {
                Toast.show('⚠️ Please enter a valid email', 'warning');
                return;
            }

            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            try {
                // Simulate API call
                await this.send(data);

                btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
                btn.style.background = 'linear-gradient(90deg, #00c853, #00abf0)';
                Toast.show('✅ Message sent successfully!', 'success');
                form.reset();
            } catch (err) {
                btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
                Toast.show('❌ Something went wrong', 'error');
            } finally {
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2500);
            }
        });
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    send(data) {
        // Simulate network delay
        return new Promise(resolve => setTimeout(resolve, 1400));
    }
};

/* ==========================================================
   12. CUSTOM CURSOR (Advanced)
   ========================================================== */
const Cursor = {
    init() {
        if (App.isMobile() || App.reducedMotion) return;

        this.cursor = App.$('#cursor');
        this.follower = App.$('#cursorFollower');
        if (!this.cursor || !this.follower) return;

        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;

        App.on(document, 'mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.cursor.style.left = this.mouseX + 'px';
            this.cursor.style.top = this.mouseY + 'px';
        });

        this.animate();

        // Interactive elements
        App.$$('a, button, .btn, .filter-btn, .social-icons a, .gallery-item, .project-box').forEach(el => {
            App.on(el, 'mouseenter', () => this.grow());
            App.on(el, 'mouseleave', () => this.shrink());
        });

        // Hide on leave window
        App.on(document, 'mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.follower.style.opacity = '0';
        });
        App.on(document, 'mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.follower.style.opacity = '1';
        });
    },

    animate() {
        this.followerX += (this.mouseX - this.followerX) * 0.15;
        this.followerY += (this.mouseY - this.followerY) * 0.15;
        this.follower.style.left = this.followerX + 'px';
        this.follower.style.top = this.followerY + 'px';
        requestAnimationFrame(() => this.animate());
    },

    grow() {
        this.follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
        this.follower.style.borderColor = '#7b2ff7';
        this.follower.style.background = 'rgba(123, 47, 247, 0.1)';
    },

    shrink() {
        this.follower.style.transform = 'translate(-50%, -50%) scale(1)';
        this.follower.style.borderColor = '#00abf0';
        this.follower.style.background = 'transparent';
    }
};

/* ==========================================================
   13. FAQ ACCORDION (Advanced)
   ========================================================== */
const FAQ = {
    init() {
        const items = App.$$('.faq-item');
        if (!items.length) return;

        items.forEach(item => {
            const q = App.$('.faq-question', item);
            App.on(q, 'click', () => {
                const isOpen = item.classList.contains('active');

                // Close all
                items.forEach(other => {
                    other.classList.remove('active');
                    const otherAns = App.$('.faq-answer', other);
                    if (otherAns) otherAns.style.maxHeight = null;
                });

                // Open clicked
                if (!isOpen) {
                    item.classList.add('active');
                    const ans = App.$('.faq-answer', item);
                    if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
                }
            });
        });
    }
};

/* ==========================================================
   14. COUNTERS (Advanced)
   ========================================================== */
const Counters = {
    animated: false,

    init() {
        const section = App.$('.counters');
        if (!section) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animated = true;
                    this.animateAll(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(section);
    },

    animateAll(parent) {
        App.$$('.counter', parent).forEach(counter => {
            this.animateOne(counter);
        });
    },

    animateOne(el) {
        const target = +el.dataset.target;
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    }
};

/* ==========================================================
   15. TESTIMONIAL SLIDER (Advanced)
   ========================================================== */
const Slider = {
    current: 0,
    total: 0,
    autoPlayTimer: null,

    init() {
        this.track = App.$('#sliderTrack');
        if (!this.track) return;

        this.slides = App.$$('.slide', this.track);
        this.total = this.slides.length;
        this.dotsContainer = App.$('#sliderDots');

        this.createDots();

        App.on(App.$('#prevSlide'), 'click', () => this.prev());
        App.on(App.$('#nextSlide'), 'click', () => this.next());

        // Touch swipe
        this.initSwipe();

        // Auto play
        this.autoPlay();

        // Pause on hover
        App.on(this.track, 'mouseenter', () => this.stopAutoPlay());
        App.on(this.track, 'mouseleave', () => this.autoPlay());
    },

    createDots() {
        if (!this.dotsContainer) return;
        this.dotsContainer.innerHTML = '';

        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('span');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            App.on(dot, 'click', () => this.goTo(i));
            this.dotsContainer.appendChild(dot);
        }
    },

    goTo(index) {
        this.current = (index + this.total) % this.total;
        this.track.style.transform = `translateX(-${this.current * 100}%)`;

        App.$$('.slider-dot', this.dotsContainer).forEach((dot, i) => {
            dot.classList.toggle('active', i === this.current);
        });
    },

    next() { this.goTo(this.current + 1); },
    prev() { this.goTo(this.current - 1); },

    autoPlay() {
        this.stopAutoPlay();
        this.autoPlayTimer = setInterval(() => this.next(), 5000);
    },

    stopAutoPlay() {
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
    },

    initSwipe() {
        let startX = 0, endX = 0;
        App.on(this.track, 'touchstart', (e) => startX = e.touches[0].clientX);
        App.on(this.track, 'touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) this.next();
            else if (endX - startX > 50) this.prev();
        });
    }
};

/* ==========================================================
   16. POPUP
   ========================================================== */
const Popup = {
    init() {
        const popup = App.$('#popup');
        const closeBtn = App.$('#popupClose');
        if (!popup) return;

        if (sessionStorage.getItem('popupShown') !== 'true') {
            setTimeout(() => {
                popup.classList.add('show');
                sessionStorage.setItem('popupShown', 'true');
            }, 15000);
        }

        App.on(closeBtn, 'click', () => popup.classList.remove('show'));
        App.on(popup, 'click', (e) => {
            if (e.target === popup) popup.classList.remove('show');
        });
    }
};

/* ==========================================================
   17. COOKIE BANNER
   ========================================================== */
const Cookies = {
    init() {
        const banner = App.$('#cookieBanner');
        if (!banner) return;

        if (!App.storage.get('cookiesChoice')) {
            setTimeout(() => banner.classList.add('show'), 3000);
        }

        App.on(App.$('#acceptCookies'), 'click', () => {
            App.storage.set('cookiesChoice', 'accepted');
            banner.classList.remove('show');
            Toast.show('🍪 Cookies accepted!', 'success');
        });

        App.on(App.$('#declineCookies'), 'click', () => {
            App.storage.set('cookiesChoice', 'declined');
            banner.classList.remove('show');
        });
    }
};

/* ==========================================================
   18. CHAT WIDGET (Advanced)
   ========================================================== */
const Chat = {
    init() {
        this.widget = App.$('#chatWidget');
        this.toggle = App.$('#chatToggle');
        this.body = App.$('#chatBody');
        this.input = App.$('#chatInput');
        if (!this.widget || !this.toggle) return;

        App.on(this.toggle, 'click', () => this.toggleChat());
        App.on(App.$('#chatClose'), 'click', () => this.close());
        App.on(App.$('#chatSend'), 'click', () => this.send());
        App.on(this.input, 'keypress', (e) => {
            if (e.key === 'Enter') this.send();
        });
    },

    toggleChat() {
        this.widget.classList.toggle('open');
        this.toggle.classList.toggle('active');

        if (this.widget.classList.contains('open')) {
            setTimeout(() => this.input?.focus(), 400);
        }
    },

    close() {
        this.widget.classList.remove('open');
        this.toggle.classList.remove('active');
    },

    send() {
        const text = this.input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        this.input.value = '';

        // Smart auto-reply
        setTimeout(() => {
            const reply = this.getReply(text);
            this.addMessage(reply, 'bot');
        }, 1200);
    },

    addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-message ${type}`;
        msg.innerHTML = `<p>${this.escape(text)}</p><span class="chat-time">Just now</span>`;
        this.body.appendChild(msg);
        this.body.scrollTop = this.body.scrollHeight;
    },

    getReply(text) {
        const lower = text.toLowerCase();
        if (lower.includes('price') || lower.includes('cost'))
            return '💰 Pricing starts from $49. Check the pricing section for details!';
        if (lower.includes('hire') || lower.includes('work'))
            return '🎯 Great! Please fill the contact form and I\'ll get back within 24 hours.';
        if (lower.includes('project') || lower.includes('portfolio'))
            return '📁 Check my Projects section to see some of my recent work!';
        if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey'))
            return '👋 Hello! How can I help you today?';
        return '👍 Thanks for your message! I\'ll get back to you soon.';
    },

    escape(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

/* ==========================================================
   19. LANGUAGE SWITCHER
   ========================================================== */
const Language = {
    init() {
        const buttons = App.$$('.lang-btn');
        if (!buttons.length) return;

        // Load saved
        const saved = App.storage.get('language', 'en');
        if (saved !== 'en') this.apply(saved, buttons);

        buttons.forEach(btn => {
            App.on(btn, 'click', () => this.apply(btn.dataset.lang, buttons));
        });
    },

    apply(lang, buttons) {
        buttons.forEach(b => b.classList.remove('active'));
        const active = buttons.find(b => b.dataset.lang === lang);
        if (active) active.classList.add('active');

        document.documentElement.lang = lang;
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        Toast.show(lang === 'ar' ? '🌍 تم تغيير اللغة' : '🌍 Language switched', 'success');
        App.storage.set('language', lang);
    }
};

/* ==========================================================
   20. ANNOUNCEMENT BAR
   ========================================================== */
const Announcement = {
    init() {
        const bar = App.$('#announcementBar');
        if (!bar) return;

        if (App.storage.get('announcementClosed') === 'true') {
            bar.style.display = 'none';
            return;
        }

        App.on(App.$('#announcementClose'), 'click', () => {
            bar.classList.add('hide');
            App.storage.set('announcementClosed', 'true');
            setTimeout(() => bar.style.display = 'none', 400);
        });
    }
};

/* ==========================================================
   21. GALLERY LIGHTBOX
   ========================================================== */
const Lightbox = {
    init() {
        const box = App.$('#lightbox');
        const img = App.$('#lightboxImage');
        if (!box || !img) return;

        App.$$('.gallery-item').forEach(item => {
            App.on(item, 'click', () => {
                const src = App.$('img', item)?.src;
                if (src) {
                    img.src = src;
                    box.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const close = () => {
            box.classList.remove('show');
            document.body.style.overflow = '';
        };

        App.on(App.$('#lightboxClose'), 'click', close);
        App.on(box, 'click', (e) => {
            if (e.target === box) close();
        });
    }
};

/* ==========================================================
   22. PROJECT MODAL
   ========================================================== */
const Modal = {
    init() {
        const modal = App.$('#projectModal');
        if (!modal) return;

        App.$$('.project-box .btn-small').forEach(btn => {
            App.on(btn, 'click', (e) => {
                e.preventDefault();
                const box = btn.closest('.project-box');
                const title = App.$('h3', box)?.textContent || 'Project';
                const desc = App.$('p', box)?.textContent || '';

                App.$('#modalTitle').textContent = title;
                App.$('#modalDescription').textContent = desc;

                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });

        const close = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        };

        App.on(App.$('#modalClose'), 'click', close);
        App.on(modal, 'click', (e) => {
            if (e.target === modal) close();
        });
    }
};

/* ==========================================================
   23. PAGE DOTS & SCROLL INDICATOR
   ========================================================== */
const Navigation = {
    init() {
        // Page dots
        App.$$('.page-dot').forEach(dot => {
            App.on(dot, 'click', (e) => {
                e.preventDefault();
                const target = App.$(dot.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll indicator dots
        App.$$('.scroll-indicator .dot').forEach(dot => {
            App.on(dot, 'click', () => {
                const target = App.$(`#${dot.dataset.section}`);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll ring click
        App.on(App.$('#scrollRing'), 'click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

/* ==========================================================
   24. KEYBOARD SHORTCUTS
   ========================================================== */
const Keyboard = {
    init() {
        App.on(document, 'keydown', (e) => {
            // ESC - close overlays
            if (e.key === 'Escape') {
                App.$$('.modal.show, .lightbox.show, .popup.show').forEach(el => {
                    el.classList.remove('show');
                });
                document.body.style.overflow = '';
                const chat = App.$('#chatWidget');
                if (chat) chat.classList.remove('open');
            }

            // Ctrl+T - toggle theme
            if (e.ctrlKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                App.$('#themeToggle')?.click();
            }

            // Home key - top
            if (e.key === 'Home' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            // End key - bottom
            if (e.key === 'End' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        });
    }
};

/* ==========================================================
   25. FORMS (Newsletter + Popup)
   ========================================================== */
const Forms = {
    init() {
        // Newsletter
        const newsletter = App.$('.newsletter-form');
        if (newsletter) {
            App.on(newsletter, 'submit', (e) => {
                e.preventDefault();
                const email = newsletter.querySelector('input[type="email"]').value;
                if (!ContactForm.isValidEmail(email)) {
                    Toast.show('⚠️ Invalid email', 'warning');
                    return;
                }
                Toast.show('✅ Subscribed successfully!', 'success');
                newsletter.reset();
            });
        }

        // Popup
        const popupForm = App.$('.popup-form');
        if (popupForm) {
            App.on(popupForm, 'submit', (e) => {
                e.preventDefault();
                const email = popupForm.querySelector('input[type="email"]').value;
                if (!ContactForm.isValidEmail(email)) {
                    Toast.show('⚠️ Invalid email', 'warning');
                    return;
                }
                Toast.show('✅ Thanks for subscribing!', 'success');
                popupForm.reset();
                App.$('#popup')?.classList.remove('show');
            });
        }
    }
};

/* ==========================================================
   26. LAZY LOADING IMAGES
   ========================================================== */
const LazyLoad = {
    init() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        App.$$('img[loading="lazy"]').forEach(img => observer.observe(img));
    }
};

/* ==========================================================
   27. PARALLAX EFFECT (Subtle)
   ========================================================== */
const Parallax = {
    init() {
        if (App.isMobile() || App.reducedMotion) return;

        const hero = App.$('.home-img');
        if (!hero) return;

        App.on(window, 'scroll', App.throttle(() => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }, 16));
    }
};

/* ==========================================================
   28. PERFORMANCE MONITOR
   ========================================================== */
const Performance = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const nav = performance.getEntriesByType('navigation')[0];
                if (!nav) return;

                const loadTime = nav.loadEventEnd - nav.startTime;
                const domTime = nav.domContentLoadedEventEnd - nav.startTime;

                console.log(
                    `%c⚡ Performance Report`,
                    'color: #00abf0; font-size: 14px; font-weight: bold;'
                );
                console.log(`%c   DOM Ready: ${domTime.toFixed(0)}ms`, 'color: #7b2ff7;');
                console.log(`%c   Full Load: ${loadTime.toFixed(0)}ms`, 'color: #00c853;');
            }, 0);
        });
    }
};

/* ==========================================================
   29. CONSOLE BRANDING
   ========================================================== */
const ConsoleArt = {
    init() {
        const style1 = 'color: #00abf0; font-size: 22px; font-weight: bold;';
        const style2 = 'color: #7b2ff7; font-size: 13px;';
        const style3 = 'color: #00c853; font-size: 12px;';

        console.log('%c👋 Ali Ahmed | Portfolio v2.0', style1);
        console.log('%c💻 Frontend Developer', style2);
        console.log('%c📧 ali@example.com', style3);
        console.log('%c🌐 https://roromlak10-bot.github.io/Ali-Ahmed/', style3);
        console.log(
            '%c💡 Tip: Press Ctrl+T to toggle theme, ESC to close modals',
            'color: #ff9800; font-size: 12px; font-style: italic;'
        );
    }
};

/* ==========================================================
   30. APP INITIALIZER
   ========================================================== */
const initApp = () => {
    try {
        Loader.init();
        MobileMenu.init();
        Typing.init();
        Theme.init();
        ScrollManager.init();
        SmoothScroll.init();
        Reveal.init();
        SkillBars.init();
        ProjectFilters.init();
        ContactForm.init();
        Cursor.init();
        FAQ.init();
        Counters.init();
        Slider.init();
        Popup.init();
        Cookies.init();
        Chat.init();
        Language.init();
        Announcement.init();
        Lightbox.init();
        Modal.init();
        Navigation.init();
        Keyboard.init();
        Forms.init();
        LazyLoad.init();
        Parallax.init();
        Performance.init();
        ConsoleArt.init();

        console.log('%c✅ All modules loaded successfully', 'color: #00c853; font-weight: bold;');
    } catch (err) {
        console.error('%c❌ Init error:', 'color: #ff0000;', err);
    }
};

/* ========== RUN ========== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
