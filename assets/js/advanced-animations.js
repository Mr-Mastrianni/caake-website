// CAAKE Website - Advanced Anime.js Animations
// This file contains advanced animations using Anime.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize advanced animations if Anime.js is available
    if (typeof anime !== 'undefined') {
        initLogoMorphing();
        initServiceGridAnimation();
        initTextScramble();
        initParallaxImages();
        initSvgDrawing();
        initAnimatedCounters();
        initAnimatedBackground();
        initFloatingElements();
        initButtonAnimations();
        initSectionReveal();
    }
});

/**
 * Morphing Logo Animation
 * Makes the logo transform and morph on hover
 */
function initLogoMorphing() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    
    logo.addEventListener('mouseenter', () => {
        anime({
            targets: logo,
            scale: [1, 1.1, 1],
            rotate: [0, 2, 0],
            filter: ['brightness(100%)', 'brightness(120%)', 'brightness(100%)'],
            duration: 800,
            easing: 'spring(1, 80, 10, 0)'
        });
    });
}

/**
 * Staggered Grid Animation for Services
 * Creates a visually stunning grid animation for the services section
 */
function initServiceGridAnimation() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            anime({
                targets: '.service-card',
                scale: [0.8, 1],
                opacity: [0, 1],
                delay: anime.stagger(100, {grid: [3, 2], from: 'center'}),
                duration: 800,
                easing: 'easeOutQuad'
            });
            observer.disconnect();
        }
    }, { threshold: 0.2 });
    
    observer.observe(document.querySelector('.services-grid'));
}

/**
 * Text Scramble Effect for Headlines
 * Creates a futuristic text scramble effect for main headlines
 */
function initTextScramble() {
    const phrases = [
        'AI-Powered Enterprise Automation',
        'Intelligent Business Solutions',
        'Future-Ready AI Technology',
        'Smart Automation for Growth'
    ];
    
    const el = document.querySelector('.hero-subtitle');
    if (!el) return;
    
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Add some CSS for the effect
    const style = document.createElement('style');
    style.textContent = `
        .dud {
            color: #7c3aed;
        }
    `;
    document.head.appendChild(style);
    
    const fx = new TextScramble(el);
    let counter = 0;
    
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000);
        });
        counter = (counter + 1) % phrases.length;
    };
    
    next();
}

/**
 * Parallax Depth Effect for Images
 * Creates a 3D parallax effect for images that responds to mouse movement
 */
function initParallaxImages() {
    const images = document.querySelectorAll('.story-image');
    if (images.length === 0) return;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        images.forEach(image => {
            const depth = parseFloat(image.getAttribute('data-depth') || 0.1);
            const moveX = mouseX * depth * 50;
            const moveY = mouseY * depth * 50;
            
            anime({
                targets: image,
                translateX: moveX,
                translateY: moveY,
                duration: 400,
                easing: 'easeOutQuad'
            });
        });
    });
    
    // Add depth attributes to your images
    images.forEach((image, index) => {
        image.setAttribute('data-depth', 0.1 + (index * 0.05));
    });
}

/**
 * Animated SVG Path Drawing for Icons
 * Creates animated SVG icons that draw themselves
 */
function initSvgDrawing() {
    // First, add SVG icons to your HTML with the class 'animated-svg'
    const svgs = document.querySelectorAll('.animated-svg path');
    if (svgs.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const path = entry.target;
                
                // Get the length of the path
                const pathLength = path.getTotalLength();
                
                // Make the path invisible initially
                path.style.strokeDasharray = pathLength;
                path.style.strokeDashoffset = pathLength;
                
                // Animate the path
                anime({
                    targets: path,
                    strokeDashoffset: [pathLength, 0],
                    duration: 1500,
                    easing: 'easeInOutSine',
                    delay: anime.stagger(150)
                });
                
                observer.unobserve(path);
            }
        });
    }, { threshold: 0.5 });
    
    svgs.forEach(svg => {
        observer.observe(svg);
    });
}

/**
 * Animated Number Counters with Easing
 * Creates animated counters that count up with a nice easing effect
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                
                anime({
                    targets: counter,
                    innerHTML: [0, target],
                    round: 1,
                    duration: 2000,
                    easing: 'easeOutExpo',
                    update: function(anim) {
                        // Add a "+" sign if it's a positive number and has a plus attribute
                        if (counter.hasAttribute('data-plus') && anim.animations[0].currentValue > 0) {
                            counter.innerHTML = '+' + counter.innerHTML;
                        }
                        // Add a "%" sign if it has a percent attribute
                        if (counter.hasAttribute('data-percent')) {
                            counter.innerHTML = counter.innerHTML + '%';
                        }
                    }
                });
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Animated Background Gradient
 * Creates a smoothly animated background gradient that shifts colors
 */
function initAnimatedBackground() {
    const section = document.querySelector('.cta-section');
    if (!section) return;
    
    // Add a gradient background to the section
    section.style.background = 'linear-gradient(135deg, #007bff, #7c3aed)';
    section.style.backgroundSize = '400% 400%';
    
    anime({
        targets: section,
        background: [
            'linear-gradient(135deg, #007bff, #7c3aed)',
            'linear-gradient(135deg, #7c3aed, #3b82f6)',
            'linear-gradient(135deg, #3b82f6, #007bff)'
        ],
        duration: 10000,
        easing: 'easeInOutQuad',
        direction: 'alternate',
        loop: true
    });
}

/**
 * Floating Elements Animation
 * Creates elements that float gently up and down with different timings
 */
function initFloatingElements() {
    const elements = document.querySelectorAll('.floating-element');
    if (elements.length === 0) return;
    
    elements.forEach((element, index) => {
        const delay = index * 200;
        const duration = 3000 + (index * 500);
        
        anime({
            targets: element,
            translateY: ['-10px', '10px'],
            duration: duration,
            delay: delay,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine'
        });
    });
}

/**
 * Button Hover Animation with Ripple Effect
 * Creates an advanced button hover animation with a ripple effect
 */
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn, .hero-button');
    if (buttons.length === 0) return;
    
    buttons.forEach(button => {
        // Create a ripple element
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        button.appendChild(ripple);
        
        // Add ripple styles
        const style = document.createElement('style');
        style.textContent = `
            .btn, .hero-button {
                position: relative;
                overflow: hidden;
            }
            .btn-ripple {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                opacity: 1;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
        
        // Add hover animation
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        // Add click ripple effect
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.top = y + 'px';
            ripple.style.left = x + 'px';
            
            anime({
                targets: ripple,
                scale: 3,
                opacity: 0,
                duration: 800,
                easing: 'easeOutExpo',
                complete: function() {
                    ripple.style.transform = 'scale(0)';
                    ripple.style.opacity = '1';
                }
            });
        });
    });
}

/**
 * Scroll-Triggered Reveal Animation for Sections
 * Creates a beautiful reveal animation for sections as they come into view
 */
function initSectionReveal() {
    const sections = document.querySelectorAll('section');
    if (sections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                
                // Add a reveal animation to the section
                anime({
                    targets: section,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 800,
                    easing: 'easeOutQuad',
                    begin: function() {
                        section.style.opacity = '0';
                        section.style.transform = 'translateY(50px)';
                    }
                });
                
                observer.unobserve(section);
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}
