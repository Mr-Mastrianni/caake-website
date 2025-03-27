// CAAKE Website JavaScript with Glassmorphism, Microinteractions, and Dark Mode

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Dark Mode
    initDarkMode();
    initMicrointeractions();
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
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
            link.addEventListener('click', function(e) {
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
    
    // Form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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
    
    // Subscribe form validation
    const subscribeForm = document.querySelector('.subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
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
            
            heading.addEventListener('click', function() {
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
        link.addEventListener('click', function(e) {
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
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            if (!navbar.classList.contains('scrolled')) {
                navbar.classList.add('scrolled');
                navbar.style.transition = 'all 0.3s ease';
                navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.padding = '0.5rem 0';
            }
        } else {
            if (navbar.classList.contains('scrolled')) {
                navbar.classList.remove('scrolled');
                navbar.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'var(--secondary-color)';
                navbar.style.padding = '1rem 0';
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
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.icon');
            if (icon) {
                icon.classList.add('animate-float');
            }
        });
        
        card.addEventListener('mouseleave', function() {
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
        input.addEventListener('animationend', function() {
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
});

// Dark Mode functionality
function initDarkMode() {
    // Create and add dark mode toggle button
    const darkModeToggle = document.createElement('div');
    darkModeToggle.className = 'dark-mode-toggle glass';
    darkModeToggle.setAttribute('aria-label', 'Toggle Dark Mode');
    darkModeToggle.setAttribute('role', 'button');
    darkModeToggle.setAttribute('tabindex', '0');
    darkModeToggle.innerHTML = '<span class="icon">🌓</span>';
    document.body.appendChild(darkModeToggle);
    
    // Check for saved theme preference or use OS preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.querySelector('.icon').textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        darkModeToggle.querySelector('.icon').textContent = '🌙';
    }
    
    // Toggle dark mode on click with animation
    darkModeToggle.addEventListener('click', function() {
        darkModeToggle.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            darkModeToggle.style.transform = 'scale(1.1)';
            setTimeout(() => {
                darkModeToggle.style.transform = 'scale(1)';
            }, 150);
        }, 150);
        
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon with animation
        const icon = this.querySelector('.icon');
        icon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            icon.style.transform = 'rotate(0)';
        }, 300);
        
        // Add transition effect to body
        document.body.style.transition = 'background-color 0.5s ease';
    });
    
    // Use a smooth transition for color changes
    document.documentElement.style.transition = 'all 0.5s ease';
    
    // Listen for OS preference changes
    prefersDarkScheme.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            darkModeToggle.querySelector('.icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
        }
    });
}

// Add microinteractions to various UI elements
function initMicrointeractions() {
    // Add hover state microinteractions to cards
    document.querySelectorAll('.service-card, .story-card, .team-member, .value-card, .benefit-card, .agent-card, .chatbot-card, .solution-card')
    .forEach(card => {
        // Add subtle floating animation on hover
        card.addEventListener('mouseenter', function() {
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
        
        card.addEventListener('mouseleave', function() {
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
        button.addEventListener('click', function(e) {
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