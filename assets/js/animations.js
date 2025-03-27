// CAAKE Website Animation Extensions
// Modern animations and interactive effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initSmoothScrolling();
    initFloatingElements();
    initProgressBars();
    initScrollFadeEffects();
    initSplitTextAnimations();
    initMorphingShapes();
    
    // Create dynamic wave background for hero section if available
    if (document.querySelector('.hero')) {
        createWaveBackground();
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            });
        });
    }
    
    // Floating animation for elements
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('[data-float]');
        
        if (floatingElements.length === 0) return;
        
        floatingElements.forEach(element => {
            const speed = element.dataset.floatSpeed || 3;
            const amplitude = element.dataset.floatAmplitude || 15;
            let counter = 0;
            
            // Set initial styles
            element.style.position = 'relative';
            element.style.transition = 'transform 0.1s ease-out';
            
            // Create animation frame
            function animateFloat() {
                counter += 0.01 * speed;
                const yPos = Math.sin(counter) * amplitude;
                
                element.style.transform = `translateY(${yPos}px)`;
                requestAnimationFrame(animateFloat);
            }
            
            // Start animation with random offset
            counter = Math.random() * Math.PI * 2; // Random starting point
            animateFloat();
        });
    }
    
    // Progress bar animations
    function initProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        if (progressBars.length === 0) return;
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.dataset.progress || '0';
                    const duration = parseInt(bar.dataset.progressDuration, 10) || 1500;
                    
                    // Create fill element if it doesn't exist
                    let fill = bar.querySelector('.progress-fill');
                    if (!fill) {
                        fill = document.createElement('div');
                        fill.classList.add('progress-fill');
                        fill.style.height = '100%';
                        fill.style.width = '0%';
                        fill.style.backgroundColor = bar.dataset.progressColor || 'var(--primary-color)';
                        fill.style.transition = `width ${duration}ms cubic-bezier(0.1, 0.5, 0.1, 1)`;
                        bar.appendChild(fill);
                    }
                    
                    // Create label if it doesn't exist
                    let label = bar.querySelector('.progress-label');
                    if (!label && bar.dataset.progressLabel !== 'false') {
                        label = document.createElement('div');
                        label.classList.add('progress-label');
                        label.style.position = 'absolute';
                        label.style.right = '10px';
                        label.style.top = '50%';
                        label.style.transform = 'translateY(-50%)';
                        label.style.fontWeight = 'bold';
                        label.style.color = bar.dataset.progressLabelColor || '#fff';
                        bar.appendChild(label);
                    }
                    
                    // Animate the progress bar
                    setTimeout(() => {
                        fill.style.width = `${percentage}%`;
                        
                        if (label) {
                            let currentValue = 0;
                            const targetValue = parseInt(percentage, 10);
                            const increment = targetValue / (duration / 16);
                            
                            const counter = setInterval(() => {
                                currentValue += increment;
                                if (currentValue >= targetValue) {
                                    currentValue = targetValue;
                                    clearInterval(counter);
                                }
                                label.textContent = `${Math.round(currentValue)}%`;
                            }, 16);
                        }
                    }, 300);
                    
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });
        
        // Observe progress bars
        progressBars.forEach(bar => {
            bar.style.position = 'relative';
            bar.style.overflow = 'hidden';
            bar.style.height = bar.dataset.progressHeight || '10px';
            bar.style.backgroundColor = bar.dataset.progressBg || '#f0f0f0';
            bar.style.borderRadius = bar.dataset.progressRadius || '5px';
            
            observer.observe(bar);
        });
    }
    
    // Scroll fade effects
    function initScrollFadeEffects() {
        const fadeElements = document.querySelectorAll('[data-fade]');
        
        if (fadeElements.length === 0) return;
        
        // Set initial state for all elements
        fadeElements.forEach(element => {
            const direction = element.dataset.fadeDirection || 'up';
            
            element.style.opacity = '0';
            element.style.transition = `opacity 0.8s ease, transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            
            // Set initial transform based on direction
            switch (direction) {
                case 'up':
                    element.style.transform = 'translateY(50px)';
                    break;
                case 'down':
                    element.style.transform = 'translateY(-50px)';
                    break;
                case 'left':
                    element.style.transform = 'translateX(50px)';
                    break;
                case 'right':
                    element.style.transform = 'translateX(-50px)';
                    break;
                case 'scale':
                    element.style.transform = 'scale(0.8)';
                    break;
                default:
                    element.style.transform = 'translateY(30px)';
            }
        });
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.dataset.fadeDelay || 0;
                    
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translate(0) scale(1)';
                    }, delay);
                    
                    // If data-fade-once is not set or true, keep observing
                    if (element.dataset.fadeOnce !== 'false') {
                        observer.unobserve(element);
                    }
                } else if (entry.target.dataset.fadeOnce === 'false') {
                    // Reset element when it leaves the viewport
                    const element = entry.target;
                    const direction = element.dataset.fadeDirection || 'up';
                    
                    element.style.opacity = '0';
                    
                    // Reset transform based on direction
                    switch (direction) {
                        case 'up':
                            element.style.transform = 'translateY(50px)';
                            break;
                        case 'down':
                            element.style.transform = 'translateY(-50px)';
                            break;
                        case 'left':
                            element.style.transform = 'translateX(50px)';
                            break;
                        case 'right':
                            element.style.transform = 'translateX(-50px)';
                            break;
                        case 'scale':
                            element.style.transform = 'scale(0.8)';
                            break;
                    }
                }
            });
        }, { threshold: 0.2 });
        
        // Observe fade elements
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Split text animations
    function initSplitTextAnimations() {
        const textElements = document.querySelectorAll('[data-split-text]');
        
        if (textElements.length === 0) return;
        
        textElements.forEach(element => {
            const text = element.textContent;
            const type = element.dataset.splitText || 'chars';
            const animation = element.dataset.splitAnimation || 'fade';
            const staggerDelay = element.dataset.splitStagger || 0.05;
            
            // Clear text initially
            element.textContent = '';
            
            // Create spans based on split type
            if (type === 'chars') {
                // Split by characters
                for (let i = 0; i < text.length; i++) {
                    const span = document.createElement('span');
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transition = 'all 0.5s ease';
                    span.style.transitionDelay = `${i * staggerDelay}s`;
                    
                    // Set initial state based on animation type
                    if (animation === 'fade') {
                        span.style.transform = 'translateY(20px)';
                    } else if (animation === 'rotate') {
                        span.style.transform = 'rotateY(90deg)';
                    } else if (animation === 'scale') {
                        span.style.transform = 'scale(0)';
                    }
                    
                    span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
                    element.appendChild(span);
                }
            } else if (type === 'words') {
                // Split by words
                const words = text.split(' ');
                
                for (let i = 0; i < words.length; i++) {
                    const span = document.createElement('span');
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transition = 'all 0.5s ease';
                    span.style.transitionDelay = `${i * staggerDelay}s`;
                    
                    // Set initial state based on animation type
                    if (animation === 'fade') {
                        span.style.transform = 'translateY(20px)';
                    } else if (animation === 'rotate') {
                        span.style.transform = 'rotateY(90deg)';
                    } else if (animation === 'scale') {
                        span.style.transform = 'scale(0)';
                    }
                    
                    span.textContent = words[i];
                    element.appendChild(span);
                    
                    // Add space after each word except the last one
                    if (i < words.length - 1) {
                        element.appendChild(document.createTextNode(' '));
                    }
                }
            }
            
            // Create intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const spans = entry.target.querySelectorAll('span');
                        
                        // Animate each span
                        spans.forEach(span => {
                            span.style.opacity = '1';
                            span.style.transform = 'translateY(0) rotateY(0) scale(1)';
                        });
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(element);
        });
    }
    
    // SVG morphing shapes backgrounds
    function initMorphingShapes() {
        const morphContainers = document.querySelectorAll('[data-morph]');
        
        if (morphContainers.length === 0) return;
        
        morphContainers.forEach(container => {
            // Create SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            svg.style.position = 'absolute';
            svg.style.top = '0';
            svg.style.left = '0';
            svg.style.zIndex = '-1';
            
            // Create path for morphing
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', container.dataset.morphColor || 'rgba(0, 123, 255, 0.1)');
            
            svg.appendChild(path);
            container.style.position = 'relative';
            container.insertBefore(svg, container.firstChild);
            
            // Get container dimensions
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            
            // Generate random blob shapes
            function generateShape() {
                const points = 8;
                const radiusMin = Math.min(width, height) * 0.3;
                const radiusMax = Math.min(width, height) * 0.4;
                const centerX = width / 2;
                const centerY = height / 2;
                
                let d = 'M';
                
                for (let i = 0; i < points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
                    
                    const x = centerX + Math.cos(angle) * radius;
                    const y = centerY + Math.sin(angle) * radius;
                    
                    if (i === 0) {
                        d += `${x},${y}`;
                    } else {
                        const cp1x = centerX + Math.cos(angle - Math.PI / points) * radius * 0.9;
                        const cp1y = centerY + Math.sin(angle - Math.PI / points) * radius * 0.9;
                        const cp2x = centerX + Math.cos(angle - Math.PI / (points * 2)) * radius * 0.9;
                        const cp2y = centerY + Math.sin(angle - Math.PI / (points * 2)) * radius * 0.9;
                        
                        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
                    }
                }
                
                d += ' Z';
                return d;
            }
            
            // Initial shape
            let currentShape = generateShape();
            path.setAttribute('d', currentShape);
            
            // Animate shape morphing
            function morphShape() {
                const nextShape = generateShape();
                
                // Animate transition
                let startTime = null;
                const duration = 5000; // 5 seconds
                
                function animate(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const elapsed = timestamp - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Redraw path
                    window.requestAnimationFrame(animate);
                    
                    if (progress === 1) {
                        // Animation complete, set new shape as current and generate next
                        currentShape = nextShape;
                        setTimeout(morphShape, 2000); // Wait 2 seconds before next morph
                    }
                }
                
                window.requestAnimationFrame(animate);
            }
            
            // Start morphing animation
            setTimeout(morphShape, 2000);
        });
    }
    
    // Create dynamic wave background
    function createWaveBackground() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        // Create canvas container
        const container = document.createElement('div');
        container.classList.add('wave-container');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.zIndex = '1';
        container.style.pointerEvents = 'none';
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.bottom = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        
        // Add canvas to container
        container.appendChild(canvas);
        
        // Insert container as first child of hero
        hero.insertBefore(container, hero.firstChild);
        
        // Get context
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight * 0.3; // Take 30% of hero height
            
            // Position canvas at the bottom
            canvas.style.height = `${canvas.height}px`;
        }
        
        // Initial resize
        resizeCanvas();
        
        // Resize on window resize
        window.addEventListener('resize', resizeCanvas);
        
        // Wave configuration
        const waves = [
            {
                color: 'rgba(0, 123, 255, 0.15)',
                amplitude: 50,
                frequency: 0.005,
                speed: 0.002,
                offset: 0
            },
            {
                color: 'rgba(255, 193, 7, 0.1)',
                amplitude: 40,
                frequency: 0.01,
                speed: 0.003,
                offset: Math.PI * 0.5
            },
            {
                color: 'rgba(255, 255, 255, 0.05)',
                amplitude: 30,
                frequency: 0.015,
                speed: 0.004,
                offset: Math.PI
            }
        ];
        
        // Create gradient for bottom fill
        let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 123, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 123, 255, 0.2)');
        
        // Animation variables
        let animationFrame;
        
        // Draw waves
        function drawWaves(timestamp) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw each wave
            waves.forEach((wave, index) => {
                // Update offset for animation
                wave.offset += wave.speed;
                
                // Begin path
                ctx.beginPath();
                ctx.moveTo(0, canvas.height * 0.5);
                
                // Draw wave path
                for (let x = 0; x < canvas.width; x++) {
                    // Calculate y position based on sine wave
                    const y = Math.sin(x * wave.frequency + wave.offset) * wave.amplitude + canvas.height * 0.5;
                    ctx.lineTo(x, y);
                }
                
                // Complete the path to create a filled shape
                ctx.lineTo(canvas.width, canvas.height);
                ctx.lineTo(0, canvas.height);
                ctx.closePath();
                
                // Fill with wave color
                ctx.fillStyle = index === waves.length - 1 ? gradient : wave.color;
                ctx.fill();
            });
            
            // Continue animation
            animationFrame = requestAnimationFrame(drawWaves);
        }
        
        // Start animation
        drawWaves();
        
        // Add parallax effect on mouse move
        document.addEventListener('mousemove', function(e) {
            const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
            const moveY = (e.clientY / window.innerHeight - 0.5) * 10;
            
            // Adjust wave parameters based on mouse position
            waves.forEach(wave => {
                wave.amplitude = wave.amplitude * (1 + moveY * 0.01);
                wave.frequency = wave.frequency * (1 + moveX * 0.005);
            });
        });
        
        // Add interactive dots floating above waves
        const dotCount = 15;
        
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('wave-dot');
            dot.style.position = 'absolute';
            dot.style.width = '4px';
            dot.style.height = '4px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            dot.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.bottom = `${Math.random() * (canvas.height / hero.offsetHeight) * 100}%`;
            dot.style.opacity = Math.random() * 0.5 + 0.3;
            dot.style.transition = 'transform 0.5s ease-out';
            
            // Add dot animation
            const size = Math.random() * 4 + 2;
            const duration = Math.random() * 10 + 5;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.animation = `float-up-down ${duration}s infinite ease-in-out`;
            dot.style.animationDelay = `${Math.random() * duration}s`;
            
            container.appendChild(dot);
        }
        
        // Clean up on page leave
        return function cleanup() {
            cancelAnimationFrame(animationFrame);
        };
    }
    
    // Add additional keyframe animations to CSS
    function addKeyframeAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-up-down {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes rotate-3d {
                0% { transform: rotate3d(1, 1, 1, 0deg); }
                100% { transform: rotate3d(1, 1, 1, 360deg); }
            }
            
            @keyframes shimmer {
                0% { background-position: -100% 0; }
                100% { background-position: 200% 0; }
            }
            
            @keyframes bounce-in {
                0% { transform: scale(0); }
                50% { transform: scale(1.1); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add CSS animations
    addKeyframeAnimations();
});