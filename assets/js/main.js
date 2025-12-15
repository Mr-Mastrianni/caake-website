// CAAKE Website JavaScript with Glassmorphism, Microinteractions, and Dark Mode

// --- Cookie Helper Functions ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// --- End Cookie Helper Functions ---

// Anime.js animation functions will be initialized after the library is loaded
// These functions are defined in anime-examples.js but we'll use them directly
// without import to avoid CORS issues when opening files locally

document.addEventListener('DOMContentLoaded', function () {
    // Set dark mode as default with no toggle option
    setDarkModeDefault();

    initMicrointeractions();

    // Initialize Anime.js animations if the library is available
    if (typeof anime !== 'undefined') {
        // Initialize scroll progress bar
        initScrollProgressBar();

        // Animate elements with data-anime attributes
        initAnimeAttributeAnimations();
    }
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Animate the hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transition = 'transform 0.3s ease';
            });

            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Mobile dropdown toggle
    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');

    dropdownLinks.forEach(link => {
        // Create mobile dropdown toggle
        if (window.innerWidth <= 768) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const dropdown = this.nextElementSibling;
                dropdown.classList.toggle('active');

                // Add slide animation
                if (dropdown.classList.contains('active')) {
                    dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
                } else {
                    dropdown.style.maxHeight = '0';
                }
            });
        }
    });

    // Form validation - using getElementById for contact form to avoid duplication
    const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;

            if (name.value.trim() === '') {
                showError(name, 'Name is required');
                isValid = false;
            } else {
                showSuccess(name);
            }

            if (email.value.trim() === '') {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                showSuccess(email);
            }

            if (message.value.trim() === '') {
                showError(message, 'Message is required');
                isValid = false;
            } else {
                showSuccess(message);
            }

            if (isValid) {
                // Add a loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;

                // Simulate form submission with delay
                setTimeout(() => {
                    // In a real application, you would submit the form data to a server
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message animate-fade-in';
                    successMsg.innerHTML = '<strong>Thank you!</strong> Your message has been sent. We will get back to you soon.';
                    successMsg.style.padding = '1rem';
                    successMsg.style.backgroundColor = '#d4edda';
                    successMsg.style.color = '#155724';
                    successMsg.style.borderRadius = '4px';
                    successMsg.style.marginTop = '1rem';

                    contactForm.reset();
                    contactForm.appendChild(successMsg);

                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;

                    // Remove success message after some time
                    setTimeout(() => {
                        successMsg.classList.add('animate-fade-out');
                        setTimeout(() => {
                            successMsg.remove();
                        }, 1000);
                    }, 5000);
                }, 1500);
            }
        });
    }

    // Subscribe form validation - using combined selector to avoid duplication
    const subscribeForm = document.querySelector('.newsletter-form') || document.querySelector('.subscribe-form');

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            let isValid = true;

            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            if (isValid) {
                // Add a loading state
                const submitButton = subscribeForm.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Subscribing...';
                submitButton.disabled = true;

                // Simulate subscription with delay
                setTimeout(() => {
                    // In a real application, you would submit to a server
                    const successMsg = document.createElement('div');
                    successMsg.className = 'success-message animate-fade-in';
                    successMsg.textContent = 'Thank you for subscribing to our newsletter!';
                    successMsg.style.padding = '0.5rem';
                    successMsg.style.backgroundColor = '#d4edda';
                    successMsg.style.color = '#155724';
                    successMsg.style.borderRadius = '4px';
                    successMsg.style.marginTop = '1rem';

                    subscribeForm.reset();
                    subscribeForm.appendChild(successMsg);

                    // Reset button
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;

                    // Remove success message after some time
                    setTimeout(() => {
                        successMsg.classList.add('animate-fade-out');
                        setTimeout(() => {
                            successMsg.remove();
                        }, 1000);
                    }, 5000);
                }, 1500);
            }
        });
    }

    // FAQ toggle with animation
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const heading = item.querySelector('h3');
        const content = item.querySelector('p');

        if (heading && content) {
            // Initialize: hide content and add transition
            content.style.maxHeight = '0';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease-in-out';

            // Add indicator for clickable items
            heading.style.cursor = 'pointer';
            heading.style.position = 'relative';

            // Add "+" indicator
            heading.insertAdjacentHTML('beforeend', '<span class="faq-toggle">+</span>');
            const toggleIcon = heading.querySelector('.faq-toggle');
            toggleIcon.style.position = 'absolute';
            toggleIcon.style.right = '0';
            toggleIcon.style.transition = 'transform 0.3s ease';

            heading.addEventListener('click', function () {
                item.classList.toggle('active');

                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    toggleIcon.style.transform = 'rotate(45deg)';
                } else {
                    content.style.maxHeight = '0';
                    toggleIcon.style.transform = 'rotate(0)';
                }
            });
        }
    });

    // Smooth scrolling for anchor links with enhanced animation
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            e.preventDefault();

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Add highlight animation to target
                const highlightAnimation = () => {
                    targetElement.style.transition = 'box-shadow 0.5s ease-in-out';
                    targetElement.style.boxShadow = '0 0 0 4px rgba(0, 123, 255, 0.5)';

                    setTimeout(() => {
                        targetElement.style.boxShadow = 'none';
                    }, 1500);
                };

                // Smooth scroll to element
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Apply highlight after scrolling
                setTimeout(highlightAnimation, 500);
            }
        });
    });

    // Enhanced fixed header on scroll with animations
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) { // Changed to 50 to match initNavbarScrollEffect threshold
            if (!navbar.classList.contains('navbar-scrolled')) { // Changed 'scrolled' to 'navbar-scrolled'
                navbar.classList.add('navbar-scrolled'); // Changed 'scrolled' to 'navbar-scrolled'
                navbar.style.transition = 'all 0.3s ease';
                // Removed the style changes since they're in CSS now
            }
        } else {
            if (navbar.classList.contains('navbar-scrolled')) { // Changed 'scrolled' to 'navbar-scrolled'
                navbar.classList.remove('navbar-scrolled'); // Changed 'scrolled' to 'navbar-scrolled'
                // Removed the style changes since they're in CSS now
            }
        }
    });

    // Enhanced animation on scroll with different animation types
    function initAnimateOnScroll() {
        const animateItems = document.querySelectorAll('.animate-on-scroll');

        // Apply initial state
        animateItems.forEach(item => {
            // Get animation type from data attribute or default to fade
            const animationType = item.dataset.animation || 'fade';

            item.style.opacity = '0';

            switch (animationType) {
                case 'fade':
                    // Default fade is just opacity
                    break;
                case 'slide-up':
                    item.style.transform = 'translateY(30px)';
                    break;
                case 'slide-left':
                    item.style.transform = 'translateX(-30px)';
                    break;
                case 'slide-right':
                    item.style.transform = 'translateX(30px)';
                    break;
                case 'scale':
                    item.style.transform = 'scale(0.9)';
                    break;
            }

            // Set transition
            const duration = item.dataset.duration || '0.6s';
            const delay = item.dataset.delay || '0s';
            item.style.transition = `opacity ${duration}, transform ${duration} ${delay}`;
        });

        function checkInView() {
            animateItems.forEach(item => {
                const elementTop = item.getBoundingClientRect().top;
                const elementBottom = item.getBoundingClientRect().bottom;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 50 && elementBottom > 0) {
                    // Item is in viewport
                    if (!item.classList.contains('visible')) {
                        item.classList.add('visible');
                        item.style.opacity = '1';

                        // Reset transforms
                        item.style.transform = 'none';
                    }
                }
            });
        }

        // Check on scroll and initial load
        window.addEventListener('scroll', checkInView);
        window.addEventListener('resize', checkInView);

        // Initial check
        setTimeout(checkInView, 100);
    }

    // Initialize animations
    initAnimateOnScroll();

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.classList.add('animate-float');
            }
        });

        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.classList.remove('animate-float');
            }
        });
    });

    // Helper functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('small');

        if (!formGroup.querySelector('.error-message')) {
            errorElement.classList.add('error-message');
            formGroup.appendChild(errorElement);
        }

        // Add animation to error
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.display = 'block';
        errorElement.style.animation = 'shake 0.5s ease';

        // Shake animation for input
        input.style.animation = 'shake 0.5s ease';
        input.addEventListener('animationend', function () {
            this.style.animation = '';
        });
    }

    function showSuccess(input) {
        input.classList.remove('error');
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');

        if (errorElement) {
            errorElement.style.display = 'none';
        }

        // Add success indicator
        input.style.borderColor = '#28a745';
        input.style.transition = 'border-color 0.3s ease';

        // Reset after delay
        setTimeout(() => {
            input.style.borderColor = '';
        }, 2000);
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Toggle mobile menu
    const navToggleMobile = document.querySelector('.nav-toggle');
    const navMenuMobile = document.querySelector('.nav-menu');

    if (navToggleMobile && navMenuMobile) {
        navToggleMobile.addEventListener('click', function () {
            navToggleMobile.classList.toggle('active');
            navMenuMobile.classList.toggle('active');

            // Update ARIA attributes
            const expanded = navToggleMobile.getAttribute('aria-expanded') === 'true' || false;
            navToggleMobile.setAttribute('aria-expanded', !expanded);
        });
    }

    // Dropdown menu functionality
    const dropdowns = document.querySelectorAll('.has-dropdown');

    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');

        if (link) {
            link.addEventListener('click', function (e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');

                    // Update ARIA attributes
                    const expanded = link.getAttribute('aria-expanded') === 'true' || false;
                    link.setAttribute('aria-expanded', !expanded);
                }
            });
        }
    });

    // Animated counters
    const counters = document.querySelectorAll('[data-counter="true"]');

    const startCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter-target'));
            const count = +counter.innerText;
            const increment = Math.ceil(target / 30);

            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(() => startCounters(), 50);
            } else {
                counter.innerText = target;
            }
        });
    };

    // Animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const animateOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.8;

        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                const animation = element.getAttribute('data-animation') || 'fade-in';
                const delay = element.getAttribute('data-delay') || '0s';

                element.style.animationDelay = delay;
                element.classList.add(animation);
                element.classList.add('animated');

                // If it's a counter, start counting
                if (element.querySelector('[data-counter="true"]')) {
                    startCounters();
                }
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Parallax effect
    const parallaxElements = document.querySelectorAll('[data-parallax="true"]');

    const parallaxEffect = () => {
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.1;
            const offset = window.pageYOffset;
            element.style.transform = `translateY(${offset * speed}px)`;
        });
    };

    window.addEventListener('scroll', parallaxEffect);

    // Image zoom effect
    const zoomImages = document.querySelectorAll('[data-zoom="true"]');

    zoomImages.forEach(image => {
        image.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.3s ease';
        });

        image.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1)';
        });

        // For accessibility
        image.addEventListener('focus', () => {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.3s ease';
        });

        image.addEventListener('blur', () => {
            image.style.transform = 'scale(1)';
        });
    });

    // Cookie consent banner
    function createCookieBanner() {
        if (!getCookie('cookieConsent')) {
            const banner = document.createElement('div');
            banner.className = 'cookie-banner';
            banner.setAttribute('role', 'alert');
            banner.setAttribute('aria-live', 'polite');

            banner.innerHTML = `
                <div class="cookie-content">
                    <p>We use cookies to enhance your experience on our website. By continuing to browse, you agree to our <a href="pages/privacy.html">Privacy Policy</a>.</p>
                    <div class="cookie-buttons">
                        <button class="cookie-accept" aria-label="Accept cookies">Accept</button>
                        <button class="cookie-settings" aria-label="Cookie settings">Settings</button>
                    </div>
                </div>
            `;

            document.body.appendChild(banner);

            // Add some basic styling
            const style = document.createElement('style');
            style.textContent = `
                .cookie-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: rgba(33, 33, 33, 0.95);
                    color: white;
                    padding: 15px;
                    z-index: 1000;
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
                }

                .cookie-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .cookie-content p {
                    flex: 1;
                    margin-right: 20px;
                    margin-bottom: 10px;
                }

                .cookie-content a {
                    color: #4fc3f7;
                    text-decoration: underline;
                }

                .cookie-buttons {
                    display: flex;
                    gap: 10px;
                }

                .cookie-accept, .cookie-settings {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    font-weight: bold;
                    transition: background-color 0.3s;
                }

                .cookie-accept {
                    background-color: #0066cc;
                    color: white;
                }

                .cookie-settings {
                    background-color: transparent;
                    color: white;
                    border: 1px solid white;
                }

                .cookie-accept:hover {
                    background-color: #0052a3;
                }

                .cookie-settings:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                @media (max-width: 768px) {
                    .cookie-content {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .cookie-content p {
                        margin-right: 0;
                        margin-bottom: 15px;
                    }
                }
            `;

            document.head.appendChild(style);

            // Handle button clicks
            const acceptButton = banner.querySelector('.cookie-accept');
            if (acceptButton) {
                acceptButton.addEventListener('click', () => {
                    setCookie('cookieConsent', 'accepted', 365);
                    banner.style.display = 'none';
                });
            }

            const settingsButton = banner.querySelector('.cookie-settings');
            if (settingsButton) {
                settingsButton.addEventListener('click', () => {
                    // Redirect to privacy page or open settings modal
                    window.location.href = 'pages/privacy.html';
                });
            }
        }
    }

    // Call the function to create the cookie banner
    createCookieBanner();

    // Testimonial carousel functionality
    function initTestimonialCarousel() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');

        let currentIndex = 0;
        let intervalId = null;

        // Function to show slide at index
        function showSlide(index) {
            // Update index if out of bounds
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            // Update current index
            currentIndex = index;

            // Hide all slides
            slides.forEach((slide, i) => {
                slide.hidden = i !== currentIndex;
                slide.setAttribute('aria-hidden', i !== currentIndex);

                // Update indicator state
                if (indicators[i]) {
                    indicators[i].classList.toggle('active', i === currentIndex);
                    indicators[i].setAttribute('aria-selected', i === currentIndex);
                }
            });
        }

        // Set up event listeners
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                showSlide(currentIndex + 1);
                resetInterval();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                showSlide(currentIndex - 1);
                resetInterval();
            });
        }

        // Set up indicator clicks
        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                showSlide(i);
                resetInterval();
            });
        });

        // Auto-advance slides
        function startInterval() {
            intervalId = setInterval(() => {
                showSlide(currentIndex + 1);
            }, 5000); // Change slides every 5 seconds
        }

        function resetInterval() {
            if (intervalId) {
                clearInterval(intervalId);
            }
            startInterval();
        }

        // Initialize the carousel
        showSlide(0);
        startInterval();

        // Pause autoplay when hovering over carousel
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            });

            carouselContainer.addEventListener('mouseleave', () => {
                if (!intervalId) {
                    startInterval();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (document.activeElement === nextButton ||
                document.activeElement === prevButton ||
                Array.from(indicators).includes(document.activeElement)) {

                if (event.key === 'ArrowLeft') {
                    showSlide(currentIndex - 1);
                    resetInterval();
                } else if (event.key === 'ArrowRight') {
                    showSlide(currentIndex + 1);
                    resetInterval();
                }
            }
        });
    }

    // Initialize the testimonial carousel
    initTestimonialCarousel();

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyLoadScript = document.createElement('script');
        lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(lazyLoadScript);

        const images = document.querySelectorAll('img:not([class*="lazyload"])');
        images.forEach(img => {
            img.classList.add('lazyload');
            img.setAttribute('data-src', img.src);
            img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        });
    }

    // Initialize performance optimizations
    initPerformanceOptimizations();

    // Initialize Accessibility Enhancements
    initAccessibility();

    // Initialize A/B Testing Framework
    initABTesting();



    // Add resize listener to adjust icon sizes properly
    window.addEventListener('resize', function () {
        const benefitIcons = document.querySelectorAll('.benefit-icon');
        benefitIcons.forEach(icon => {
            if (window.innerWidth <= 768) {
                icon.style.width = '40px';
                icon.style.height = '40px';
                icon.style.fontSize = '1.4rem';
            } else {
                icon.style.width = '50px';
                icon.style.height = '50px';
                icon.style.fontSize = '1.8rem';
            }
        });
    });

    // Note: We're already calling initNavbarScrollEffect here, but the implementation
    // does the same thing as the scroll event handler above, so we can just keep one of them.
    // Let's keep the function call for consistency with other init functions.
    initNavbarScrollEffect();

    // Smooth scrolling for internal links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    // Smooth scroll to element
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Update URL hash without jumping
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Initialize smooth scrolling
    initSmoothScrolling();

    // Image lazy loading (moved from HTML to main.js)
    function initLazyLoading() {
        // Check if IntersectionObserver is supported
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;

                        // If there's a data-srcset attribute, set it too
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }

                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            const lazyImages = document.querySelectorAll('img[data-src]');

            // Load all images immediately
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                img.classList.add('loaded');
            });
        }
    }

    // Initialize lazy loading
    initLazyLoading();

    // Add any other initializations here...
    console.log("CAAKE Website Initialized - Scroll effect added");
});

/**
 * Performance optimization initialization
 */
function initPerformanceOptimizations() {
    // Detect low-end devices and reduce animations
    if (isLowEndDevice()) {
        document.body.classList.add('reduced-motion');
        disableHeavyAnimations();
    }

    // Optimize image loading
    optimizeImageLoading();

    // Optimize event handlers
    optimizeEventHandlers();

    // Add animation intersection observers
    initAnimationObservers();

    // Optimize heavy calculations
    optimizeCalculations();

    // Report Core Web Vitals
    reportCoreWebVitals();
}

/**
 * Check if the device is low-end and should have reduced animations
 * @returns {boolean}
 */
function isLowEndDevice() {
    // Check for memory constraints
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true;
    }

    // Check for CPU constraints
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true;
    }

    // Check for Reduced Motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
    }

    // Check for mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 768) {
        return true;
    }

    return false;
}

/**
 * Disable heavy animations for low-end devices
 */
function disableHeavyAnimations() {
    // Remove 3D/WebGL animations if present
    const animationContainers = document.querySelectorAll('[data-animation]');
    animationContainers.forEach(container => {
        // Keep the container but replace heavy animations with simpler ones
        if (container.getAttribute('data-animation') === 'neural-network' ||
            container.getAttribute('data-animation') === '3d' ||
            container.getAttribute('data-animation') === 'particles') {

            // Replace with a simpler gradient animation
            container.setAttribute('data-animation', 'simple');
            container.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)';
        }
    });

    // Reduce other animations duration
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .animate-on-scroll {
            animation-duration: 0.3s !important;
        }
        .animate-float {
            animation: none !important;
        }
        .service-card:hover,
        .story-card:hover,
        .team-member:hover,
        .btn:hover {
            transform: none !important;
        }
    `;
    document.head.appendChild(styleElement);
}

/**
 * Use Intersection Observer to load animations only when visible
 */
function initAnimationObservers() {
    if ('IntersectionObserver' in window) {
        const animationElements = document.querySelectorAll('.animate-on-scroll, [data-parallax]');

        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Add visible class for CSS animations
                    if (element.classList.contains('animate-on-scroll')) {
                        element.classList.add('visible');
                    }

                    // For parallax elements, only process when visible
                    if (element.hasAttribute('data-parallax')) {
                        element.setAttribute('data-parallax-active', 'true');
                    }

                    // Unobserve after animation is triggered
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px 50px 0px'
        });

        animationElements.forEach(element => {
            animationObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            element.classList.add('visible');
        });
    }
}

/**
 * Optimize image loading with aspect ratio enforcement
 */
function optimizeImageLoading() {
    // Find all images without explicit dimension attributes
    const images = document.querySelectorAll('img:not([width]):not([height])');

    images.forEach(img => {
        // Set explicit dimensions to prevent CLS
        img.setAttribute('width', '500');
        img.setAttribute('height', '300');

        // Add loading attribute if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

/**
 * Optimize event handlers with debouncing and throttling
 */
function optimizeEventHandlers() {
    // Replace scroll listeners with more efficient ones
    const oldScrollHandler = window.onscroll;

    if (oldScrollHandler) {
        // Clean up existing handler
        window.onscroll = null;

        // Replace with throttled version
        window.addEventListener('scroll', throttle(oldScrollHandler, 100));
    }

    // Optimize resize event
    const oldResizeHandler = window.onresize;

    if (oldResizeHandler) {
        window.onresize = null;
        window.addEventListener('resize', debounce(oldResizeHandler, 150));
    }
}

/**
 * Function to debounce expensive operations
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Function to throttle expensive operations
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function executedFunction(...args) {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Optimize heavy calculations by deferring non-critical ones
 */
function optimizeCalculations() {
    // Defer non-critical animations and calculations
    setTimeout(() => {
        // Initialize counters with Intersection Observer
        if ('IntersectionObserver' in window) {
            const counterElements = document.querySelectorAll('[data-counter]');

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const target = parseInt(element.getAttribute('data-counter-target'), 10);
                        const duration = element.hasAttribute('data-counter-duration') ?
                            parseInt(element.getAttribute('data-counter-duration'), 10) :
                            2000;

                        animateCounter(element, target, duration);
                        counterObserver.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1
            });

            counterElements.forEach(element => {
                counterObserver.observe(element);
            });
        }
    }, 500);
}

/**
 * Animate counter with optimized animation frame handling
 */
function animateCounter(element, target, duration) {
    let start = 0;
    const startTime = performance.now();
    const step = timestamp => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * target);

        if (value !== start) {
            element.textContent = value;
            start = value;
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(step);
}

/**
 * Monitor and report Core Web Vitals when supported
 */
function reportCoreWebVitals() {
    if ('PerformanceObserver' in window) {
        try {
            // LCP (Largest Contentful Paint)
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime / 1000, 'seconds');

                // Optimize if LCP is poor
                if (lastEntry.startTime > 2500) {
                    document.body.classList.add('optimize-lcp');
                }
            });

            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

            // FID (First Input Delay)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const firstInput = entries[0];
                console.log('FID:', firstInput.processingStart - firstInput.startTime, 'ms');

                // Optimize if FID is poor
                if (firstInput.processingStart - firstInput.startTime > 100) {
                    document.body.classList.add('optimize-fid');
                }
            });

            fidObserver.observe({ type: 'first-input', buffered: true });

            // CLS (Cumulative Layout Shift)
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                let clsScore = 0;

                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsScore += entry.value;
                    }
                });

                console.log('CLS:', clsScore);

                // Optimize if CLS is poor
                if (clsScore > 0.1) {
                    document.body.classList.add('optimize-cls');
                }
            });

            clsObserver.observe({ type: 'layout-shift', buffered: true });

        } catch (e) {
            console.log('Performance monitoring not supported', e);
        }
    }
}

// Set dark mode as default permanently
function setDarkModeDefault() {
    // Force dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');

    // Add additional dark mode classes if needed
    document.body.classList.add('dark-mode');
}

// Replace the initDarkMode function with this empty function to prevent it from running
function initDarkMode() {
    // Do nothing - dark mode is set by default with no toggle
    console.log("Dark mode set as default");
}

/**
 * Initialize scroll progress bar animation using Anime.js
 */
function initScrollProgressBar() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    // Update animation based on scroll position
    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

        // Update progress bar width
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * Animate elements with data-anime attributes
 */
function initAnimeAttributeAnimations() {
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

// Add microinteractions to various UI elements
function initMicrointeractions() {
    // Add hover state microinteractions to cards
    document.querySelectorAll('.service-card, .story-card, .team-member, .value-card, .benefit-card, .agent-card, .chatbot-card, .solution-card')
        .forEach(card => {
            // Add subtle floating animation on hover
            card.addEventListener('mouseenter', function () {
                this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';

                // Add glassmorphism effect on hover
                if (!this.classList.contains('glass')) {
                    this.style.backgroundColor = 'var(--card-bg)';
                    this.style.backdropFilter = 'blur(var(--blur-amount))';
                    this.style.webkitBackdropFilter = 'blur(var(--blur-amount))';
                    this.style.border = '1px solid var(--card-border)';
                }
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = '';
                this.style.boxShadow = '';

                // Remove glassmorphism if not already glass
                if (!this.classList.contains('glass')) {
                    this.style.backgroundColor = '';
                    this.style.backdropFilter = '';
                    this.style.webkitBackdropFilter = '';
                    this.style.border = '';
                }
            });
        });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            // Create ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';

            // Calculate position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            // Position the ripple
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            // Ensure button has position relative
            if (window.getComputedStyle(this).position === 'static') {
                this.style.position = 'relative';
            }

            // Add overflow hidden
            this.style.overflow = 'hidden';

            // Add the ripple to the button
            this.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add background shapes to sections for visual interest
    document.querySelectorAll('section').forEach(section => {
        // Don't add if already has shapes
        if (section.querySelector('.bg-shape')) return;

        const shape1 = document.createElement('div');
        shape1.className = 'bg-shape bg-shape-1';
        section.appendChild(shape1);

        const shape2 = document.createElement('div');
        shape2.className = 'bg-shape bg-shape-2';
        section.appendChild(shape2);
    });
}

/**
 * Initialize Accessibility Enhancements
 */
function initAccessibility() {
    // Keyboard navigation for dropdowns
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.nextElementSibling;
        const dropdownItems = dropdown.querySelectorAll('a');

        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openDropdown(toggle, dropdown);
                dropdownItems[0]?.focus(); // Focus first item
            }
        });

        dropdown.addEventListener('keydown', function (e) {
            const currentFocusIndex = Array.from(dropdownItems).indexOf(document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentFocusIndex + 1) % dropdownItems.length;
                dropdownItems[nextIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentFocusIndex - 1 + dropdownItems.length) % dropdownItems.length;
                dropdownItems[prevIndex]?.focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown(toggle, dropdown);
                toggle.focus(); // Return focus to the toggle
            } else if (e.key === 'Tab' && !e.shiftKey && currentFocusIndex === dropdownItems.length - 1) {
                // Close dropdown when tabbing out of the last item
                closeDropdown(toggle, dropdown);
                // Focus is handled by the browser
            } else if (e.key === 'Tab' && e.shiftKey && currentFocusIndex === 0) {
                // Close dropdown when shift-tabbing out of the first item
                closeDropdown(toggle, dropdown);
                // Focus is handled by the browser
            }
        });

        // Close dropdown if clicking outside
        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !dropdown.contains(e.target) && toggle.getAttribute('aria-expanded') === 'true') {
                closeDropdown(toggle, dropdown);
            }
        });
    });

    function openDropdown(toggle, dropdown) {
        toggle.setAttribute('aria-expanded', 'true');
        dropdown.style.display = 'block'; // Or appropriate display style
        dropdown.querySelectorAll('a').forEach(item => item.setAttribute('tabindex', '0'));
    }

    function closeDropdown(toggle, dropdown) {
        toggle.setAttribute('aria-expanded', 'false');
        dropdown.style.display = 'none';
        dropdown.querySelectorAll('a').forEach(item => item.setAttribute('tabindex', '-1'));
    }

    // Keyboard navigation for carousels (basic example)
    const carousels = document.querySelectorAll('.testimonial-carousel');
    carousels.forEach(carousel => {
        const prevButton = carousel.nextElementSibling?.querySelector('.prev');
        const nextButton = carousel.nextElementSibling?.querySelector('.next');
        const slides = carousel.querySelectorAll('.testimonial'); // Adjust selector if needed

        if (prevButton && nextButton && slides.length > 0) {
            carousel.setAttribute('tabindex', '0'); // Make carousel focusable

            carousel.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevButton.click(); // Simulate click on prev
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextButton.click(); // Simulate click on next
                }
            });
        }
    });

    // Keyboard navigation for FAQ toggles
    const faqButtons = document.querySelectorAll('.faq-toggle-button');
    faqButtons.forEach(button => {
        button.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            const answer = document.getElementById(this.getAttribute('aria-controls'));
            if (answer) {
                answer.style.maxHeight = expanded ? '0' : answer.scrollHeight + 'px';
                answer.setAttribute('aria-hidden', expanded);
                this.querySelector('.faq-toggle').textContent = expanded ? '+' : '−';
            }
        });
        // Enter/Space keys already trigger buttons, so no specific keydown needed for activation
    });

    // Ensure modals trap focus (basic example - needs robust implementation)
    const modals = document.querySelectorAll('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]');
    modals.forEach(modal => {
        // Requires a more complex focus trapping library or implementation
        // For now, just ensure close button works with Escape
        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const closeButton = modal.querySelector('.popup-close, .search-close, .chatbot-close');
                closeButton?.click();
            }
        });
    });
}

/**
 * A/B Testing Framework (Simple Example)
 */
function initABTesting() {
    // Skip A/B testing for search engine crawlers to maintain consistent content
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('googlebot') ||
        userAgent.includes('bingbot') ||
        userAgent.includes('yandexbot') ||
        userAgent.includes('baiduspider') ||
        userAgent.includes('slurp') ||
        userAgent.includes('duckduckbot')) {
        console.log('Search engine crawler detected, skipping A/B testing');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    let variation = params.get('ab_test_variation') || getCookie('ab_test_variation');

    if (!variation) {
        // Assign variation randomly (50/50 split)
        variation = Math.random() < 0.5 ? 'A' : 'B';
        setCookie('ab_test_variation', variation, 7); // Store for 7 days
    }

    console.log(`A/B Test Variation: ${variation}`);

    // Apply variations based on the assigned group
    applyVariations(variation);

    // Optional: Send data to analytics
    // trackABTestVariation(variation);
}

function applyVariations(variation) {
    // Example: Hero Section A/B Test
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const originalTitle = "Revolutionize Your Business with AI Automation";
        const originalSubtitle = "Leverage cutting-edge AI technology to streamline operations, increase efficiency, and drive growth.";
        const originalButton1Text = "Get Free Assessment";
        const originalButton2Text = "Explore Solutions";

        const variationBTitle = "Unlock Growth with AI-Powered Automation";
        const variationBSubtitle = "Transform your business operations with intelligent AI solutions designed for maximum impact.";
        const variationBButton1Text = "Start Your AI Assessment";
        const variationBButton2Text = "Discover AI Services";

        if (variation === 'B') {
            console.log('Applying Variation B to Hero Section');
            heroContent.querySelector('.hero-title').textContent = variationBTitle;
            heroContent.querySelector('.hero-subtitle').textContent = variationBSubtitle;
            const buttons = heroContent.querySelectorAll('.hero-button');
            if (buttons.length >= 2) {
                buttons[0].textContent = variationBButton1Text;
                buttons[1].textContent = variationBButton2Text;
            }
            document.body.classList.add('ab-test-variation-b'); // Add class for potential CSS changes
        } else {
            // Variation A (or control) - Ensure original content is shown
            console.log('Applying Variation A (Control) to Hero Section');
            heroContent.querySelector('.hero-title').textContent = originalTitle;
            heroContent.querySelector('.hero-subtitle').textContent = originalSubtitle;
            const buttons = heroContent.querySelectorAll('.hero-button');
            if (buttons.length >= 2) {
                buttons[0].textContent = originalButton1Text;
                buttons[1].textContent = originalButton2Text;
            }
            document.body.classList.add('ab-test-variation-a');
        }
    }

    // Add more A/B test variations here for other elements/pages
}



// NEW FUNCTION: Navbar Scroll Effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return; // Exit if navbar not found

    const scrollThreshold = 50; // Pixels to scroll before changing navbar style

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // Initial check in case the page is loaded scrolled down
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for better performance
}

// Load Anime.js animations initialization script
function loadAnimeAnimations() {
    const script = document.createElement('script');
    script.src = 'assets/js/anime-animations/init.js';
    script.onload = function () {
        // Initialize Anime.js animations when the script is loaded
        if (window.initAnimeAnimations && document.querySelector('[data-anime-animation]')) {
            console.log('Found anime.js animation elements, initializing...');

            // Check if Anime.js is loaded
            if (typeof anime === 'undefined') {
                // Load Anime.js dynamically if not already loaded
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
                script.onload = () => {
                    console.log('Anime.js loaded dynamically');
                    initAnimeAnimations();
                };
                document.head.appendChild(script);
            } else {
                // Initialize directly if Anime.js is already loaded
                window.initAnimeAnimations();
            }
        }
    };
    document.head.appendChild(script);
}

// Call the function to load anime animations
document.addEventListener('DOMContentLoaded', loadAnimeAnimations);