// CAAKE Website - Advanced AI Animations using Anime.js v4
// This file contains custom 3D animations for AI concepts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations if Anime.js is available
    if (typeof anime !== 'undefined') {
        // Initialize all animations
        initNeuralNetworkAnimation();
        initDataFlowAnimation();
        initAITransformationAnimation();
        initScrollTriggers();
    } else {
        console.warn('Anime.js is not loaded. AI animations will not work.');
    }
});

/**
 * Neural Network Animation
 * Creates a 3D neural network with nodes and connections that light up
 */
function initNeuralNetworkAnimation() {
    const container = document.querySelector('.neural-network-animation');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 500');
    svg.setAttribute('class', 'neural-network-svg');
    container.appendChild(svg);
    
    // Create layers of nodes
    const layers = [5, 8, 10, 8, 5]; // Number of nodes in each layer
    const nodes = [];
    const connections = [];
    
    // Calculate positions
    const width = 800;
    const height = 500;
    const layerSpacing = width / (layers.length + 1);
    
    // Create nodes
    layers.forEach((nodeCount, layerIndex) => {
        const layerX = layerSpacing * (layerIndex + 1);
        const nodeSpacing = height / (nodeCount + 1);
        
        const layerNodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const nodeY = nodeSpacing * (i + 1);
            
            // Create node circle
            const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            node.setAttribute('cx', layerX);
            node.setAttribute('cy', nodeY);
            node.setAttribute('r', 8);
            node.setAttribute('fill', '#4d9fff');
            node.setAttribute('class', 'neural-node');
            node.setAttribute('data-layer', layerIndex);
            node.setAttribute('data-index', i);
            svg.appendChild(node);
            
            // Add glow filter
            const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            glowFilter.setAttribute('id', `glow-${layerIndex}-${i}`);
            
            const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur.setAttribute('stdDeviation', '2.5');
            feGaussianBlur.setAttribute('result', 'coloredBlur');
            glowFilter.appendChild(feGaussianBlur);
            
            const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
            
            const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
            feMergeNode1.setAttribute('in', 'coloredBlur');
            feMerge.appendChild(feMergeNode1);
            
            const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
            feMergeNode2.setAttribute('in', 'SourceGraphic');
            feMerge.appendChild(feMergeNode2);
            
            glowFilter.appendChild(feMerge);
            svg.appendChild(glowFilter);
            
            layerNodes.push({
                element: node,
                x: layerX,
                y: nodeY,
                layer: layerIndex,
                index: i
            });
        }
        
        nodes.push(layerNodes);
    });
    
    // Create connections between layers
    for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
        const currentLayer = nodes[layerIndex];
        const nextLayer = nodes[layerIndex + 1];
        
        currentLayer.forEach(sourceNode => {
            nextLayer.forEach(targetNode => {
                // Create connection line
                const connection = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                connection.setAttribute('x1', sourceNode.x);
                connection.setAttribute('y1', sourceNode.y);
                connection.setAttribute('x2', targetNode.x);
                connection.setAttribute('y2', targetNode.y);
                connection.setAttribute('stroke', '#4d9fff');
                connection.setAttribute('stroke-width', '1');
                connection.setAttribute('opacity', '0.3');
                connection.setAttribute('class', 'neural-connection');
                connection.setAttribute('data-source-layer', sourceNode.layer);
                connection.setAttribute('data-source-index', sourceNode.index);
                connection.setAttribute('data-target-layer', targetNode.layer);
                connection.setAttribute('data-target-index', targetNode.index);
                
                // Insert connections before nodes so they appear behind
                svg.insertBefore(connection, svg.firstChild);
                
                connections.push({
                    element: connection,
                    sourceNode: sourceNode,
                    targetNode: targetNode
                });
            });
        });
    }
    
    // Add CSS for 3D effect
    const style = document.createElement('style');
    style.textContent = `
        .neural-network-svg {
            width: 100%;
            height: 100%;
            perspective: 1000px;
        }
        
        .neural-node {
            transform-origin: center;
            transform: translateZ(0);
            transition: all 0.3s ease;
        }
        
        .neural-connection {
            transform-origin: center;
            transform: translateZ(0);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Animate the network
    animateNeuralNetwork(nodes, connections);
}

/**
 * Animate the neural network
 */
function animateNeuralNetwork(nodes, connections) {
    // Animate nodes with a subtle pulse
    anime({
        targets: '.neural-node',
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        duration: 3000,
        delay: anime.stagger(100, {grid: [5, 5], from: 'center'}),
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
    
    // Randomly activate connections
    setInterval(() => {
        // Select a random connection
        const randomConnection = connections[Math.floor(Math.random() * connections.length)];
        const connection = randomConnection.element;
        
        // Activate the connection
        anime({
            targets: connection,
            opacity: [0.3, 0.8, 0.3],
            strokeWidth: [1, 3, 1],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
        
        // Activate the source and target nodes
        anime({
            targets: [
                randomConnection.sourceNode.element,
                randomConnection.targetNode.element
            ],
            fill: ['#4d9fff', '#9d6eff', '#4d9fff'],
            r: [8, 12, 8],
            filter: [
                'none',
                `url(#glow-${randomConnection.sourceNode.layer}-${randomConnection.sourceNode.index})`,
                'none'
            ],
            duration: 1000,
            easing: 'easeInOutQuad'
        });
    }, 500);
    
    // Add 3D rotation effect on mouse move
    const container = document.querySelector('.neural-network-animation');
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        
        anime({
            targets: '.neural-network-svg',
            rotateY: mouseX * 10,
            rotateX: -mouseY * 10,
            duration: 400,
            easing: 'easeOutQuad'
        });
    });
}

/**
 * Data Flow Animation
 * Creates a 3D animation showing data flowing through a system
 */
function initDataFlowAnimation() {
    const container = document.querySelector('.data-flow-animation');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.setAttribute('class', 'data-flow-svg');
    container.appendChild(svg);
    
    // Create data flow path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M50,200 C150,100 250,300 350,200 S550,100 650,200 S750,300 750,200');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#4d9fff');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('class', 'data-flow-path');
    svg.appendChild(path);
    
    // Create data points
    const dataPointCount = 20;
    const dataPoints = [];
    
    for (let i = 0; i < dataPointCount; i++) {
        const dataPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dataPoint.setAttribute('r', 6 + Math.random() * 6);
        dataPoint.setAttribute('fill', '#9d6eff');
        dataPoint.setAttribute('class', 'data-point');
        dataPoint.style.opacity = 0;
        svg.appendChild(dataPoint);
        
        dataPoints.push(dataPoint);
    }
    
    // Add CSS for 3D effect
    const style = document.createElement('style');
    style.textContent = `
        .data-flow-svg {
            width: 100%;
            height: 100%;
            perspective: 1000px;
        }
        
        .data-flow-path {
            filter: drop-shadow(0 0 8px rgba(77, 159, 255, 0.5));
        }
        
        .data-point {
            filter: drop-shadow(0 0 5px rgba(157, 110, 255, 0.7));
        }
    `;
    document.head.appendChild(style);
    
    // Animate the data flow
    animateDataFlow(path, dataPoints);
}

/**
 * Animate the data flow
 */
function animateDataFlow(path, dataPoints) {
    // Create motion path animation for data points
    const pathLength = path.getTotalLength();
    
    // Animate each data point along the path
    dataPoints.forEach((dataPoint, index) => {
        // Calculate delay based on index
        const delay = index * 300;
        
        // Create motion path animation
        anime({
            targets: dataPoint,
            translateX: {
                value: function(el, i) {
                    return anime.setDashoffset(path) - anime.setDashoffset(path) * (i / 100);
                },
                duration: 3000,
                delay: delay,
                easing: 'linear'
            },
            translateY: {
                value: function(el, i) {
                    return anime.setDashoffset(path) - anime.setDashoffset(path) * (i / 100);
                },
                duration: 3000,
                delay: delay,
                easing: 'linear'
            },
            opacity: {
                value: [0, 1, 0],
                duration: 3000,
                delay: delay,
                easing: 'linear'
            },
            loop: true,
            autoplay: true,
            update: function(anim) {
                // Get the current progress
                const progress = anim.progress / 100;
                
                // Calculate the point on the path
                const point = path.getPointAtLength(pathLength * progress);
                
                // Update the position
                dataPoint.setAttribute('cx', point.x);
                dataPoint.setAttribute('cy', point.y);
            }
        });
    });
    
    // Animate the path with a pulse effect
    anime({
        targets: '.data-flow-path',
        strokeWidth: [4, 6, 4],
        opacity: [0.7, 1, 0.7],
        duration: 2000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
    
    // Add 3D rotation effect on mouse move
    const container = document.querySelector('.data-flow-animation');
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        
        anime({
            targets: '.data-flow-svg',
            rotateY: mouseX * 15,
            rotateX: -mouseY * 15,
            duration: 400,
            easing: 'easeOutQuad'
        });
    });
}

/**
 * AI Transformation Animation
 * Creates a 3D animation showing shapes morphing and transforming
 */
function initAITransformationAnimation() {
    const container = document.querySelector('.ai-transformation-animation');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 500');
    svg.setAttribute('class', 'transformation-svg');
    container.appendChild(svg);
    
    // Create shapes
    const shapes = [];
    
    // Square shape
    const square = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    square.setAttribute('d', 'M300,150 L500,150 L500,350 L300,350 Z');
    square.setAttribute('fill', '#4d9fff');
    square.setAttribute('class', 'shape square-shape');
    svg.appendChild(square);
    shapes.push(square);
    
    // Circle shape
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    circle.setAttribute('d', 'M400,150 C461,150 511,200 511,250 C511,300 461,350 400,350 C339,350 289,300 289,250 C289,200 339,150 400,150 Z');
    circle.setAttribute('fill', '#9d6eff');
    circle.setAttribute('class', 'shape circle-shape');
    circle.style.opacity = 0;
    svg.appendChild(circle);
    shapes.push(circle);
    
    // Triangle shape
    const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    triangle.setAttribute('d', 'M400,150 L500,350 L300,350 Z');
    triangle.setAttribute('fill', '#ff4d9f');
    triangle.setAttribute('class', 'shape triangle-shape');
    triangle.style.opacity = 0;
    svg.appendChild(triangle);
    shapes.push(triangle);
    
    // Hexagon shape
    const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hexagon.setAttribute('d', 'M350,150 L450,150 L500,250 L450,350 L350,350 L300,250 Z');
    hexagon.setAttribute('fill', '#4dff9f');
    hexagon.setAttribute('class', 'shape hexagon-shape');
    hexagon.style.opacity = 0;
    svg.appendChild(hexagon);
    shapes.push(hexagon);
    
    // Star shape
    const star = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    star.setAttribute('d', 'M400,150 L425,225 L500,225 L450,275 L475,350 L400,300 L325,350 L350,275 L300,225 L375,225 Z');
    star.setAttribute('fill', '#ffcc4d');
    star.setAttribute('class', 'shape star-shape');
    star.style.opacity = 0;
    svg.appendChild(star);
    shapes.push(star);
    
    // Add data points around the shapes
    const dataPointCount = 50;
    const dataPoints = [];
    
    for (let i = 0; i < dataPointCount; i++) {
        const dataPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dataPoint.setAttribute('cx', 400 + (Math.random() - 0.5) * 300);
        dataPoint.setAttribute('cy', 250 + (Math.random() - 0.5) * 200);
        dataPoint.setAttribute('r', 2 + Math.random() * 3);
        dataPoint.setAttribute('fill', '#ffffff');
        dataPoint.setAttribute('class', 'data-point');
        dataPoint.style.opacity = 0.5;
        svg.appendChild(dataPoint);
        
        dataPoints.push(dataPoint);
    }
    
    // Add CSS for 3D effect
    const style = document.createElement('style');
    style.textContent = `
        .transformation-svg {
            width: 100%;
            height: 100%;
            perspective: 1000px;
        }
        
        .shape {
            filter: drop-shadow(0 0 10px rgba(77, 159, 255, 0.5));
            transform-origin: center;
            transform: translateZ(0);
        }
        
        .data-point {
            filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
        }
    `;
    document.head.appendChild(style);
    
    // Animate the transformation
    animateTransformation(shapes, dataPoints);
}

/**
 * Animate the AI transformation
 */
function animateTransformation(shapes, dataPoints) {
    // Create a timeline for shape morphing
    const timeline = anime.timeline({
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
    
    // Square to Circle
    timeline.add({
        targets: '.square-shape',
        d: [
            { value: 'M300,150 L500,150 L500,350 L300,350 Z' },
            { value: 'M400,150 C461,150 511,200 511,250 C511,300 461,350 400,350 C339,350 289,300 289,250 C289,200 339,150 400,150 Z' }
        ],
        fill: ['#4d9fff', '#9d6eff'],
        duration: 2000,
        easing: 'easeInOutQuad'
    });
    
    // Circle to Triangle
    timeline.add({
        targets: '.square-shape',
        d: [
            { value: 'M400,150 C461,150 511,200 511,250 C511,300 461,350 400,350 C339,350 289,300 289,250 C289,200 339,150 400,150 Z' },
            { value: 'M400,150 L500,350 L300,350 Z' }
        ],
        fill: ['#9d6eff', '#ff4d9f'],
        duration: 2000,
        easing: 'easeInOutQuad'
    });
    
    // Triangle to Hexagon
    timeline.add({
        targets: '.square-shape',
        d: [
            { value: 'M400,150 L500,350 L300,350 Z' },
            { value: 'M350,150 L450,150 L500,250 L450,350 L350,350 L300,250 Z' }
        ],
        fill: ['#ff4d9f', '#4dff9f'],
        duration: 2000,
        easing: 'easeInOutQuad'
    });
    
    // Hexagon to Star
    timeline.add({
        targets: '.square-shape',
        d: [
            { value: 'M350,150 L450,150 L500,250 L450,350 L350,350 L300,250 Z' },
            { value: 'M400,150 L425,225 L500,225 L450,275 L475,350 L400,300 L325,350 L350,275 L300,225 L375,225 Z' }
        ],
        fill: ['#4dff9f', '#ffcc4d'],
        duration: 2000,
        easing: 'easeInOutQuad'
    });
    
    // Star to Square (to complete the loop)
    timeline.add({
        targets: '.square-shape',
        d: [
            { value: 'M400,150 L425,225 L500,225 L450,275 L475,350 L400,300 L325,350 L350,275 L300,225 L375,225 Z' },
            { value: 'M300,150 L500,150 L500,350 L300,350 Z' }
        ],
        fill: ['#ffcc4d', '#4d9fff'],
        duration: 2000,
        easing: 'easeInOutQuad'
    });
    
    // Animate data points
    anime({
        targets: '.data-point',
        translateX: function() { return anime.random(-20, 20); },
        translateY: function() { return anime.random(-20, 20); },
        scale: function() { return anime.random(0.5, 1.5); },
        opacity: function() { return anime.random(0.3, 0.8); },
        duration: function() { return anime.random(1000, 3000); },
        delay: anime.stagger(10),
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine'
    });
    
    // Add 3D rotation effect on mouse move
    const container = document.querySelector('.ai-transformation-animation');
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
        
        anime({
            targets: '.transformation-svg',
            rotateY: mouseX * 20,
            rotateX: -mouseY * 20,
            duration: 400,
            easing: 'easeOutQuad'
        });
    });
}

/**
 * Initialize scroll triggers for animations
 */
function initScrollTriggers() {
    // Get all animation containers
    const animationContainers = document.querySelectorAll(
        '.neural-network-animation, .data-flow-animation, .ai-transformation-animation'
    );
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animations
                entry.target.classList.add('visible');
                
                // Add entrance animation
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    duration: 1000,
                    easing: 'easeOutQuad'
                });
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each container
    animationContainers.forEach(container => {
        observer.observe(container);
    });
}
