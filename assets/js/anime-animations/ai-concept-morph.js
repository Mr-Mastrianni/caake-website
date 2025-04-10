/**
 * AI Concept Morph Animation
 *
 * An SVG morphing animation that transforms between different AI concept shapes
 * Uses Anime.js for smooth animations and transitions
 */

class AIConceptMorphAnimation {
    constructor(containerId, options = {}) {
        // Default options
        this.options = Object.assign({
            width: '100%',
            height: '100%',
            backgroundColor: '#070B14',
            svgWidth: 400,
            svgHeight: 300,
            transitionDuration: 3000,
            staggerDelay: 100,
            loopDelay: 1500,
            strokeWidth: 2,
            colors: {
                primary: '#4d9fff',
                secondary: '#9d6eff',
                accent: '#ff4d9f',
                highlight: '#44dd88'
            }
        }, options);

        // Get container element
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        // Setup container styles
        this.setupContainer();

        // AI concept shapes (SVG paths)
        this.shapes = {
            brain: this.createBrainShape(),
            circuit: this.createCircuitShape(),
            network: this.createNetworkShape(),
            robot: this.createRobotShape(),
            data: this.createDataShape()
        };

        // Create SVG element
        this.createSvg();

        // Create background elements
        this.createBackground();

        // Current shape index
        this.currentShapeIndex = 0;

        // Get shape names as array
        this.shapeNames = Object.keys(this.shapes);

        // Start animation
        this.startAnimation();
    }

    setupContainer() {
        // Set container styles if not already styled
        if (!this.container.style.position || this.container.style.position === 'static') {
            this.container.style.position = 'relative';
        }

        this.container.style.width = this.options.width;
        this.container.style.height = this.options.height;
        this.container.style.backgroundColor = this.options.backgroundColor;
        this.container.style.overflow = 'hidden';
    }

    createSvg() {
        // Create main SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', this.options.svgWidth);
        this.svg.setAttribute('height', this.options.svgHeight);
        this.svg.setAttribute('viewBox', `0 0 ${this.options.svgWidth} ${this.options.svgHeight}`);
        this.svg.style.position = 'absolute';
        this.svg.style.top = '50%';
        this.svg.style.left = '50%';
        this.svg.style.transform = 'translate(-50%, -50%)';

        // Create path for shape morphing
        this.mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.mainPath.setAttribute('fill', 'none');
        this.mainPath.setAttribute('stroke', this.options.colors.primary);
        this.mainPath.setAttribute('stroke-width', this.options.strokeWidth);

        // Add path to SVG
        this.svg.appendChild(this.mainPath);

        // Add SVG to container
        this.container.appendChild(this.svg);
    }

    createBackground() {
        // Create a dynamic background with particle-like elements
        this.backgroundSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.backgroundSvg.setAttribute('width', '100%');
        this.backgroundSvg.setAttribute('height', '100%');
        this.backgroundSvg.style.position = 'absolute';
        this.backgroundSvg.style.top = '0';
        this.backgroundSvg.style.left = '0';
        this.backgroundSvg.style.zIndex = '-1';

        // Add particles
        this.particles = [];
        for (let i = 0; i < 30; i++) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;

            // Random size
            const size = 1 + Math.random() * 4;

            // Random color
            const colorKeys = Object.keys(this.options.colors);
            const color = this.options.colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];

            circle.setAttribute('cx', `${x}%`);
            circle.setAttribute('cy', `${y}%`);
            circle.setAttribute('r', size);
            circle.setAttribute('fill', color);
            circle.style.opacity = 0.1 + Math.random() * 0.3;

            this.backgroundSvg.appendChild(circle);
            this.particles.push(circle);
        }

        // Add connecting lines
        this.lines = [];
        for (let i = 0; i < 15; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

            // Connect random particles
            const p1 = Math.floor(Math.random() * this.particles.length);
            let p2 = Math.floor(Math.random() * this.particles.length);
            while (p1 === p2) {
                p2 = Math.floor(Math.random() * this.particles.length);
            }

            const particle1 = this.particles[p1];
            const particle2 = this.particles[p2];

            line.setAttribute('x1', particle1.getAttribute('cx'));
            line.setAttribute('y1', particle1.getAttribute('cy'));
            line.setAttribute('x2', particle2.getAttribute('cx'));
            line.setAttribute('y2', particle2.getAttribute('cy'));

            line.setAttribute('stroke', this.options.colors.secondary);
            line.setAttribute('stroke-width', 0.5);
            line.style.opacity = 0.1;

            this.backgroundSvg.appendChild(line);
            this.lines.push(line);
        }

        this.container.appendChild(this.backgroundSvg);

        // Animate background particles
        this.animateBackground();
    }

    animateBackground() {
        // Animate particles with subtle movement and opacity changes
        if (typeof anime === 'undefined') {
            console.error('Anime.js library is required for this animation.');
            return;
        }

        // Animate each particle
        this.particles.forEach((particle, index) => {
            const x = parseFloat(particle.getAttribute('cx'));
            const y = parseFloat(particle.getAttribute('cy'));

            // Random movement range
            const rangeX = 5 + Math.random() * 10;
            const rangeY = 5 + Math.random() * 10;

            // Random duration
            const duration = 5000 + Math.random() * 10000;

            // Animate position and opacity
            anime({
                targets: particle,
                cx: [
                    { value: x - rangeX, duration: duration / 2, easing: 'easeInOutSine' },
                    { value: x + rangeX, duration: duration / 2, easing: 'easeInOutSine' }
                ],
                cy: [
                    { value: y - rangeY, duration: duration / 2, easing: 'easeInOutSine' },
                    { value: y + rangeY, duration: duration / 2, easing: 'easeInOutSine' }
                ],
                opacity: [
                    { value: 0.05, duration: duration / 3, easing: 'easeInOutQuad' },
                    { value: 0.3, duration: duration / 3, easing: 'easeInOutQuad' },
                    { value: 0.1, duration: duration / 3, easing: 'easeInOutQuad' }
                ],
                loop: true,
                direction: 'alternate',
                delay: index * 100
            });
        });

        // Update lines to follow particles
        const updateLines = () => {
            this.lines.forEach((line, index) => {
                // Find the two particles this line connects
                const x1Index = parseInt(line.getAttribute('data-p1') || 0);
                const x2Index = parseInt(line.getAttribute('data-p2') || 1);

                const p1 = this.particles[x1Index] || this.particles[0];
                const p2 = this.particles[x2Index] || this.particles[1];

                line.setAttribute('x1', p1.getAttribute('cx'));
                line.setAttribute('y1', p1.getAttribute('cy'));
                line.setAttribute('x2', p2.getAttribute('cx'));
                line.setAttribute('y2', p2.getAttribute('cy'));
            });

            requestAnimationFrame(updateLines);
        };

        updateLines();
    }

    startAnimation() {
        if (typeof anime === 'undefined') {
            console.error('Anime.js library is required for this animation.');
            return;
        }

        // Set initial shape
        const initialShape = this.shapes[this.shapeNames[0]];
        this.mainPath.setAttribute('d', initialShape);

        // Create timeline for morphing animation
        this.timeline = anime.timeline({
            loop: true,
            direction: 'normal'
        });

        // Add animations for each shape to the timeline
        this.shapeNames.forEach((shapeName, index) => {
            const nextIndex = (index + 1) % this.shapeNames.length;
            const nextShape = this.shapes[this.shapeNames[nextIndex]];

            // Add morphing animation
            this.timeline.add({
                targets: this.mainPath,
                d: [
                    { value: nextShape, duration: this.options.transitionDuration }
                ],
                stroke: [
                    {
                        value: () => {
                            // Cycle through colors
                            const colorKeys = Object.keys(this.options.colors);
                            return this.options.colors[colorKeys[nextIndex % colorKeys.length]];
                        },
                        duration: this.options.transitionDuration
                    }
                ],
                easing: 'easeInOutQuad',
                changeBegin: () => {
                    this.currentShapeIndex = nextIndex;
                }
            }, `+=${this.options.loopDelay}`);
        });

        // Create staggered duplicate paths that follow the main path
        for (let i = 1; i <= 3; i++) {
            const echoPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            echoPath.setAttribute('fill', 'none');
            echoPath.setAttribute('stroke', this.options.colors.accent);
            echoPath.setAttribute('stroke-width', this.options.strokeWidth - (i * 0.5));
            echoPath.setAttribute('stroke-dasharray', '3,3');
            echoPath.setAttribute('d', initialShape);
            echoPath.style.opacity = 0.3 - (i * 0.1);
            this.svg.appendChild(echoPath);

            // Follow main path with delay
            anime({
                targets: echoPath,
                d: () => this.mainPath.getAttribute('d'),
                stroke: () => this.mainPath.getAttribute('stroke'),
                easing: 'easeOutSine',
                duration: 500,
                delay: i * this.options.staggerDelay,
                loop: true,
                update: function(anim) {
                    // Echo path always follows the main path with delay
                    echoPath.setAttribute('d', this.mainPath.getAttribute('d'));
                }.bind(this)
            });
        }

        // Add random "burst" animations
        this.addRandomBursts();
    }

    addRandomBursts() {
        // Create bursts that randomly appear and disappear
        setInterval(() => {
            // Random position
            const x = Math.random() * this.options.svgWidth;
            const y = Math.random() * this.options.svgHeight;

            // Create burst circle
            const burst = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            burst.setAttribute('cx', x);
            burst.setAttribute('cy', y);
            burst.setAttribute('r', 0);
            burst.setAttribute('fill', 'none');
            burst.setAttribute('stroke', this.options.colors.highlight);
            burst.setAttribute('stroke-width', '1');

            this.svg.appendChild(burst);

            // Animate burst
            anime({
                targets: burst,
                r: [0, 30],
                opacity: [1, 0],
                easing: 'easeOutExpo',
                duration: 1500,
                complete: () => {
                    this.svg.removeChild(burst);
                }
            });
        }, 2000);
    }

    // SVG path data for different AI concepts
    createBrainShape() {
        // Brain shape (centered in viewBox)
        const centerX = this.options.svgWidth / 2;
        const centerY = this.options.svgHeight / 2;
        const scale = Math.min(this.options.svgWidth, this.options.svgHeight) * 0.35;

        // Ensure consistent spacing and valid numbers
        return `M ${centerX - scale * 0.8} ${centerY}
                C ${centerX - scale * 0.8} ${centerY - scale * 0.5} ${centerX - scale * 0.4} ${centerY - scale * 0.8} ${centerX} ${centerY - scale * 0.7}
                C ${centerX + scale * 0.4} ${centerY - scale * 0.8} ${centerX + scale * 0.8} ${centerY - scale * 0.5} ${centerX + scale * 0.8} ${centerY}
                C ${centerX + scale * 0.8} ${centerY + scale * 0.5} ${centerX + scale * 0.4} ${centerY + scale * 0.8} ${centerX} ${centerY + scale * 0.7}
                C ${centerX - scale * 0.4} ${centerY + scale * 0.8} ${centerX - scale * 0.8} ${centerY + scale * 0.5} ${centerX - scale * 0.8} ${centerY}
                Z
                M ${centerX - scale * 0.15} ${centerY - scale * 0.2}
                C ${centerX - scale * 0.05} ${centerY - scale * 0.3} ${centerX + scale * 0.05} ${centerY - scale * 0.3} ${centerX + scale * 0.15} ${centerY - scale * 0.2}
                M ${centerX - scale * 0.2} ${centerY + scale * 0.2}
                C ${centerX - scale * 0.1} ${centerY + scale * 0.3} ${centerX + scale * 0.1} ${centerY + scale * 0.3} ${centerX + scale * 0.2} ${centerY + scale * 0.2}
                M ${centerX} ${centerY - scale * 0.7}
                L ${centerX} ${centerY + scale * 0.7}`;
    }

    createCircuitShape() {
        // Circuit board pattern (centered in viewBox)
        const centerX = this.options.svgWidth / 2;
        const centerY = this.options.svgHeight / 2;
        const scale = Math.min(this.options.svgWidth, this.options.svgHeight) * 0.35;

        // Ensure consistent spacing
        return `M ${centerX - scale * 0.8} ${centerY - scale * 0.8}
                L ${centerX - scale * 0.4} ${centerY - scale * 0.8}
                L ${centerX - scale * 0.4} ${centerY - scale * 0.4}
                L ${centerX - scale * 0.8} ${centerY - scale * 0.4}
                L ${centerX - scale * 0.8} ${centerY}
                L ${centerX - scale * 0.4} ${centerY}
                L ${centerX - scale * 0.4} ${centerY + scale * 0.4}
                L ${centerX} ${centerY + scale * 0.4}
                L ${centerX} ${centerY - scale * 0.4}
                L ${centerX + scale * 0.4} ${centerY - scale * 0.4}
                L ${centerX + scale * 0.4} ${centerY + scale * 0.4}
                L ${centerX + scale * 0.8} ${centerY + scale * 0.4}
                L ${centerX + scale * 0.8} ${centerY - scale * 0.4}
                L ${centerX + scale * 0.4} ${centerY - scale * 0.4}
                L ${centerX + scale * 0.4} ${centerY - scale * 0.8}
                L ${centerX + scale * 0.8} ${centerY - scale * 0.8}
                M ${centerX - scale * 0.6} ${centerY - scale * 0.8}
                L ${centerX - scale * 0.6} ${centerY - scale * 0.6}
                M ${centerX - scale * 0.2} ${centerY - scale * 0.4}
                L ${centerX - scale * 0.2} ${centerY - scale * 0.2}
                M ${centerX + scale * 0.2} ${centerY - scale * 0.4}
                L ${centerX + scale * 0.2} ${centerY - scale * 0.2}
                M ${centerX + scale * 0.6} ${centerY + scale * 0.4}
                L ${centerX + scale * 0.6} ${centerY + scale * 0.6}
                M ${centerX - scale * 0.2} ${centerY + scale * 0.4}
                L ${centerX - scale * 0.2} ${centerY + scale * 0.6}`;
    }

    createNetworkShape() {
        // Network node pattern (centered in viewBox)
        const centerX = this.options.svgWidth / 2;
        const centerY = this.options.svgHeight / 2;
        const scale = Math.min(this.options.svgWidth, this.options.svgHeight) * 0.35;

        let path = '';

        // Center node - Correct arc flags to use spaces: 0 1 0
        const centerNodeRadius = scale * 0.15;
        path += `M ${centerX} ${centerY} m 0 -${centerNodeRadius} a ${centerNodeRadius} ${centerNodeRadius} 0 1 0 0 ${centerNodeRadius * 2} a ${centerNodeRadius} ${centerNodeRadius} 0 1 0 0 -${centerNodeRadius * 2}`;

        const nodeCount = 6;
        const nodeRadius = scale * 0.1;
        const orbitRadius = scale * 0.6;

        for (let i = 0; i < nodeCount; i++) {
            const angle = (Math.PI * 2 * i) / nodeCount;
            const x = centerX + Math.cos(angle) * orbitRadius;
            const y = centerY + Math.sin(angle) * orbitRadius;

            // Draw node - Correct arc flags to use spaces: 0 1 0
            path += ` M ${x} ${y} m 0 -${nodeRadius} a ${nodeRadius} ${nodeRadius} 0 1 0 0 ${nodeRadius * 2} a ${nodeRadius} ${nodeRadius} 0 1 0 0 -${nodeRadius * 2}`;

            path += ` M ${centerX} ${centerY} L ${x} ${y}`;

            const nextI = (i + 1) % nodeCount;
            const nextAngle = (Math.PI * 2 * nextI) / nodeCount;
            const nextX = centerX + Math.cos(nextAngle) * orbitRadius;
            const nextY = centerY + Math.sin(nextAngle) * orbitRadius;

            path += ` M ${x} ${y} L ${nextX} ${nextY}`;
        }

        return path;
    }

    createRobotShape() {
        const centerX = this.options.svgWidth / 2;
        const centerY = this.options.svgHeight / 2;
        const scale = Math.min(this.options.svgWidth, this.options.svgHeight) * 0.35;
        const eyeRadius = scale * 0.05;

        // Correct arc flags to use spaces: 0 1 0
        return `M ${centerX - scale * 0.3} ${centerY - scale * 0.7}
                L ${centerX + scale * 0.3} ${centerY - scale * 0.7}
                L ${centerX + scale * 0.3} ${centerY - scale * 0.3}
                L ${centerX + scale * 0.5} ${centerY - scale * 0.3}
                L ${centerX + scale * 0.5} ${centerY + scale * 0.3}
                L ${centerX + scale * 0.3} ${centerY + scale * 0.3}
                L ${centerX + scale * 0.3} ${centerY + scale * 0.7}
                L ${centerX - scale * 0.3} ${centerY + scale * 0.7}
                L ${centerX - scale * 0.3} ${centerY + scale * 0.3}
                L ${centerX - scale * 0.5} ${centerY + scale * 0.3}
                L ${centerX - scale * 0.5} ${centerY - scale * 0.3}
                L ${centerX - scale * 0.3} ${centerY - scale * 0.3}
                Z
                M ${centerX - scale * 0.15} ${centerY - scale * 0.5}
                a ${eyeRadius} ${eyeRadius} 0 1 0 0 ${eyeRadius * 2}
                a ${eyeRadius} ${eyeRadius} 0 1 0 0 -${eyeRadius * 2}
                M ${centerX + scale * 0.15} ${centerY - scale * 0.5}
                a ${eyeRadius} ${eyeRadius} 0 1 0 0 ${eyeRadius * 2}
                a ${eyeRadius} ${eyeRadius} 0 1 0 0 -${eyeRadius * 2}
                M ${centerX - scale * 0.15} ${centerY - scale * 0.25}
                L ${centerX + scale * 0.15} ${centerY - scale * 0.25}`;
    }

    createDataShape() {
        const centerX = this.options.svgWidth / 2;
        const centerY = this.options.svgHeight / 2;
        const scale = Math.min(this.options.svgWidth, this.options.svgHeight) * 0.35;

        let path = '';

        const barWidth = scale * 0.15;
        const barGap = scale * 0.05;
        const barStartX = centerX - ((barWidth * 5 + barGap * 4) / 2);
        const barBaseY = centerY + scale * 0.6;
        const barHeights = [0.4, 0.7, 0.9, 0.6, 0.5];

        for (let i = 0; i < 5; i++) {
            const x = barStartX + i * (barWidth + barGap);
            const height = scale * barHeights[i];
            path += ` M ${x} ${barBaseY} L ${x} ${barBaseY - height} L ${x + barWidth} ${barBaseY - height} L ${x + barWidth} ${barBaseY}`;
        }

        const pieX = centerX;
        const pieY = centerY - scale * 0.3;
        const pieRadius = scale * 0.3;

        // Draw circle outline - Correct arc flags to use spaces: 0 1 0
        path += ` M ${pieX} ${pieY - pieRadius}
                a ${pieRadius} ${pieRadius} 0 1 0 0 ${pieRadius * 2}
                a ${pieRadius} ${pieRadius} 0 1 0 0 -${pieRadius * 2}`;

        const segments = 3;
        for (let i = 0; i < segments; i++) {
            const startAngle = (Math.PI * 2 * i) / segments;
            const x1 = pieX + Math.cos(startAngle) * pieRadius;
            const y1 = pieY + Math.sin(startAngle) * pieRadius;
            path += ` M ${pieX} ${pieY} L ${x1} ${y1}`;
        }

        return path;
    }
}

// Make the class available globally
window.AIConceptMorphAnimation = AIConceptMorphAnimation;