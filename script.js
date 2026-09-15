/* ==========================================================
   Ali Ahmed | Portfolio Script
   Full Interactive Features
   ========================================================== */

'use strict';

/* ========== 1. Loading Screen ========== */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
            setTimeout(() => loader.style.display = 'none', 600);
        }, 900);
    }
});

/* ========== 2. Mobile Menu Toggle ========== */
const menuIcon = document.getElementById('menuIcon');
const navbar = document.getElementById('navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('fa-xmark');
        menuIcon.classList.toggle('fa-bars');
        navbar.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        });
    });
}

/* ========== 3. Typing Effect ========== */
const typingElement = document.querySelector('.typing');
const words = [
    'Web Developer',
    'Frontend Developer',
    'JavaScript Lover',
    'Problem Solver',
    'UI Enthusiast'
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typingElement) return;

    const currentWord = words[wordIndex];
    typingElement.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 1500);
        } else {
            setTimeout(typeEffect, 300);
        }
    }
}
typeEffect();

/* ========== 4. Theme Toggle (Dark / Light) ========== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

// Load saved theme on page start
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');

        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });
}

/* ========== 5. Scroll Events (Progress + Active Link + Back to Top) ========== */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const header = document.getElementById('header');

function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Progress bar
    if (progressBar) progressBar.style.width = scrollPercent + '%';

    // Active navbar link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (scrollTop >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Back to top button
    if (backToTop) {
        if (scrollTop > 400) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    }

    // Header shadow on scroll
    if (header) {
        header.classList.toggle('scrolled', scrollTop > 50);
    }
}

window.addEventListener('scroll', handleScroll);
handleScroll();

/* ========== 6. Smooth Scroll for Anchors ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

/* ========== 7. Fade-in Sections on Scroll ========== */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('section').forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(40px)';
    sec.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(sec);
});

/* ========== 8. Skill Bars Animation ========== */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar span').forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width;
                }, i * 150);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.35 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ========== 9. Project Filters ========== */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectBoxes = document.querySelectorAll('.project-box');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectBoxes.forEach(box => {
            if (filter === 'all' || box.dataset.category === filter) {
                box.classList.remove('hide');
                box.style.animation = 'none';
                // Trigger reflow for re-animation
                void box.offsetWidth;
                box.style.animation = 'fadeUp 0.5s ease forwards';
            } else {
                box.classList.add('hide');
            }
        });
    });
});

/* ========== 10. Contact Form ========== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Simulate sending
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(90deg, #00c853, #00abf0)';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
}

/* ========== 11. Custom Cursor ========== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (window.innerWidth > 768 && cursor && cursorFollower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effect on interactive elements
    document.querySelectorAll('a, button, .btn, .filter-btn, .social-icons a').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.style.transform = 'scale(1.6)';
            cursorFollower.style.borderColor = '#7b2ff7';
            cursorFollower.style.background = 'rgba(123, 47, 247, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.borderColor = '#00abf0';
            cursorFollower.style.background = 'transparent';
        });
    });
}

/* ========== 12. Reveal Elements (Stats + Info) ========== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.stat, .info-item, .about-info li').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

/* ========== 13. Console Greeting ========== */
console.log(
    '%c👋 Hey there! Thanks for checking out my portfolio.',
    'color: #00abf0; font-size: 14px; font-weight: bold;'
);
console.log(
    '%c💻 Built with HTML, CSS & JavaScript by Ali Ahmed',
    'color: #7b2ff7; font-size: 13px;'
);
