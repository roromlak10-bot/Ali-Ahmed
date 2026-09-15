'use strict';

/* 1. Loading Screen */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hide');
            setTimeout(() => loader.style.display = 'none', 600);
        }, 900);
    }
});

/* 2. Mobile Menu */
const menuIcon = document.getElementById('menuIcon');
const navbar = document.getElementById('navbar');
if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        menuIcon.classList.toggle('fa-xmark');
        menuIcon.classList.toggle('fa-bars');
        navbar.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('fa-xmark');
            menuIcon.classList.add('fa-bars');
        });
    });
}

/* 3. Typing Effect */
const typingElement = document.querySelector('.typing');
const words = ['Web Developer', 'Frontend Developer', 'JavaScript Lover', 'Content Creator', 'Problem Solver'];
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    if (!typingElement) return;
    const currentWord = words[wordIndex];
    typingElement.textContent = currentWord.substring(0, charIndex);
    let delay = 100;

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        delay = 50;
    } else if (!isDeleting) {
        isDeleting = true;
        delay = 1500;
    } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300;
    }
    setTimeout(typeEffect, delay);
}
typeEffect();

/* 4. Theme Toggle */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
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

/* 5. Scroll Handling */
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const header = document.getElementById('header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = scrollPercent + '%';
    if (header) header.classList.toggle('scrolled', scrollTop > 50);
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 400);

    let current = '';
    sections.forEach(section => {
        if (scrollTop >= section.offsetTop - 150) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}
window.addEventListener('scroll', handleScroll);
handleScroll();

/* 6. Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#' || id === '') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

/* 7. Fade-in Sections */
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            sectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

sections.forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(40px)';
    sec.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    sectionObserver.observe(sec);
});

/* 8. Skill Bars */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar span').forEach((bar, i) => {
                setTimeout(() => { bar.style.width = bar.dataset.width; }, i * 150);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* 9. Card Reveal */
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.service-box, .project-box, .skill-box, .info-item, .about-info li').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`;
    cardObserver.observe(el);
});

/* 10. Contact Form */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
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

/* 11. Console Branding */
console.log('%c👋 Ali Ahmed | Portfolio', 'color: #00abf0; font-size: 18px; font-weight: bold;');
console.log('%c📺 YouTube: @Hunt_Joker', 'color: #ff0000; font-size: 13px; font-weight: bold;');
