// CAAKE Website - Anime.js Examples
// This file demonstrates how to use Anime.js v4 for animations on the CAAKE website
// See full documentation in anime-js-v4-documentation.md

// Import Anime.js from CDN (for production, consider installing via npm)
import anime from 'https://unpkg.com/animejs@4.0.0/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Anime.js animations
    initHeroAnimation();
    initServiceCardAnimations();
    initCounterAnimations();
    initScrollLinkedAnimations();
    
    // Add data-anime attribute to elements you want to animate with Anime.js
    setupAnimeAttributeAnimations();
});

/**
 * Animate the hero section elements
 */
function initHeroAnimation() {
    const heroElement = document.querySelector('.hero');
    if (!heroElement) return;
    
    // Create a timeline for sequenced animations
    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 750
    });
    
    // Add animations to the timeline
    timeline
        .add({
            targets: '.hero h1',
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800
        })
        .add({
            targets: '.hero p',
            opacity: [0, 1],
            translateY: [30, 0]
        }, '-=600') // Start 600ms before the previous animation ends
        .add({
            targets: '.hero .cta-button',
            opacity: [0, 1],
            translateY: [20, 0],
            scale: [0.9, 1]
        }, '-=400'); // Start 400ms before the previous animation ends
}

/**
 * Animate service cards with staggered effect
 */
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length === 0) return;
    
    // Create an Intersection Observer to trigger animations when cards are visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the card when it enters the viewport
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    scale: [0.9, 1],
                    duration: 600,
                    easing: 'easeOutCubic'
                });
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    // Observe each service card
    serviceCards.forEach(card => {
        card.style.opacity = '0'; // Set initial state
        observer.observe(card);
    });
}

/**
 * Animate numerical counters
 */
function initCounterAnimations() {
    const counterElements = document.querySelectorAll('.counter');
    if (counterElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetValue = parseInt(target.getAttribute('data-target-value') || '0');
                
                // Create a counter object to animate
                const counter = { value: 0 };
                
                // Animate the counter
                anime({
                    targets: counter,
                    value: targetValue,
                    round: 1, // Round to whole numbers
                    duration: 2000,
                    easing: 'easeInOutQuad',
                    update: function() {
                        target.innerHTML = counter.value;
                    }
                });
                
                // Stop observing after animation
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe each counter element
    counterElements.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Create scroll-linked animations
 */
function initScrollLinkedAnimations() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    // Create an animation that will be controlled by scroll
    const progressAnimation = anime({
        targets: progressBar,
        width: ['0%', '100%'],
        easing: 'linear',
        autoplay: false // Don't play automatically
    });
    
    // Update animation based on scroll position
    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        // Update animation progress
        progressAnimation.seek((scrollPercent / 100) * progressAnimation.duration);
    });
}

/**
 * Set up animations for elements with data-anime attribute
 * Example usage in HTML: <div data-anime="fadeIn" data-anime-delay="300">Content</div>
 */
function setupAnimeAttributeAnimations() {
    const elements = document.querySelectorAll('[data-anime]');
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-anime');
                const delay = parseInt(element.getAttribute('data-anime-delay') || '0');
                
                // Apply animation based on data-anime attribute
                switch (animationType) {
                    case 'fadeIn':
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            duration: 800,
                            delay: delay,
                            easing: 'easeOutCubic'
                        });
                        break;
                        
                    case 'slideUp':
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 800,
                            delay: delay,
                            easing: 'easeOutCubic'
                        });
                        break;
                        
                    case 'slideLeft':
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            translateX: [-50, 0],
                            duration: 800,
                            delay: delay,
                            easing: 'easeOutCubic'
                        });
                        break;
                        
                    case 'slideRight':
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            translateX: [50, 0],
                            duration: 800,
                            delay: delay,
                            easing: 'easeOutCubic'
                        });
                        break;
                        
                    case 'zoomIn':
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            scale: [0.5, 1],
                            duration: 800,
                            delay: delay,
                            easing: 'easeOutCubic'
                        });
                        break;
                        
                    case 'bounce':
                        anime({
                            targets: element,
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 1200,
                            delay: delay,
                            easing: 'spring(1, 80, 10, 0)'
                        });
                        break;
                }
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Set initial state and observe each element
    elements.forEach(element => {
        element.style.opacity = '0'; // Set initial state
        observer.observe(element);
    });
}

// Export functions for use in other modules
export {
    initHeroAnimation,
    initServiceCardAnimations,
    initCounterAnimations,
    initScrollLinkedAnimations,
    setupAnimeAttributeAnimations
};
