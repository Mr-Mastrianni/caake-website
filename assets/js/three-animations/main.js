import NeuralNetworkAnimation from './neural-network.js';
import WorkflowAutomationAnimation from './workflow-automation.js';
import DigitalTwinAnimation from './digital-twin.js';
import DataVisualizationAnimation from './data-visualization.js';

// Check if GSAP is loaded, if not load it
if (typeof gsap === 'undefined') {
    console.log('Loading GSAP...');
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js';
    script.async = true;
    document.head.appendChild(script);
    
    // Wait for GSAP to load
    script.onload = () => {
        console.log('GSAP loaded, initializing animations...');
        initAnimations();
    };
} else {
    console.log('GSAP already loaded, initializing animations...');
    initAnimations();
}

// Animation instances
let neuralNetworkInstance = null;
let workflowAutomationInstance = null;
let digitalTwinInstance = null;
let dataVisualizationInstance = null;

// Initialization function
function initAnimations() {
    // Initialize animations on elements with specific data attributes
    initAnimationByType('neural-network');
    initAnimationByType('workflow-automation');
    initAnimationByType('digital-twin');
    initAnimationByType('data-visualization');
    
    // Set up scroll-based animation visibility
    setupScrollObserver();
}

// Initialize specific animation type
function initAnimationByType(type) {
    const elements = document.querySelectorAll(`[data-animation="${type}"]`);
    
    elements.forEach(element => {
        // Get animation options from data attributes if any
        const options = getOptionsFromDataAttributes(element);
        
        // Create animation container if it doesn't exist
        if (!element.querySelector('.animation-container')) {
            const container = document.createElement('div');
            container.className = 'animation-container';
            container.style.width = '100%';
            container.style.height = '100%';
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.zIndex = '-1';
            container.id = `${type}-container-${Math.floor(Math.random() * 10000)}`;
            element.appendChild(container);
            
            // Initialize animation based on type
            switch (type) {
                case 'neural-network':
                    neuralNetworkInstance = new NeuralNetworkAnimation(container.id, options);
                    break;
                case 'workflow-automation':
                    workflowAutomationInstance = new WorkflowAutomationAnimation(container.id, options);
                    break;
                case 'digital-twin':
                    digitalTwinInstance = new DigitalTwinAnimation(container.id, options);
                    break;
                case 'data-visualization':
                    dataVisualizationInstance = new DataVisualizationAnimation(container.id, options);
                    break;
            }
            
            console.log(`Initialized ${type} animation`);
        }
    });
}

// Get options from data attributes
function getOptionsFromDataAttributes(element) {
    const options = {};
    
    // Parse data attributes
    Array.from(element.attributes)
        .filter(attr => attr.name.startsWith('data-option-'))
        .forEach(attr => {
            const optionName = attr.name.replace('data-option-', '');
            let optionValue = attr.value;
            
            // Try to parse JSON values
            try {
                optionValue = JSON.parse(optionValue);
            } catch (e) {
                // If not valid JSON, keep as string
            }
            
            options[optionName] = optionValue;
        });
    
    return options;
}

// Set up Intersection Observer to handle animations on scroll
function setupScrollObserver() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported');
        return;
    }
    
    const animationElements = document.querySelectorAll('[data-animation]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const type = entry.target.getAttribute('data-animation');
            const container = entry.target.querySelector('.animation-container');
            
            if (entry.isIntersecting) {
                // Show animation when in viewport
                if (container) {
                    container.style.opacity = '1';
                }
                
                // Resume animation if it was paused
                resumeAnimation(type);
            } else {
                // Optionally hide or pause animation when out of viewport
                // This can help with performance
                if (container) {
                    container.style.opacity = '0.3';
                }
                
                // Pause animation to save resources
                pauseAnimation(type);
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    // Observe all animation elements
    animationElements.forEach(element => {
        observer.observe(element);
    });
}

// Pause specific animation
function pauseAnimation(type) {
    switch (type) {
        case 'neural-network':
            if (neuralNetworkInstance && neuralNetworkInstance.renderer) {
                neuralNetworkInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'workflow-automation':
            if (workflowAutomationInstance && workflowAutomationInstance.renderer) {
                workflowAutomationInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'digital-twin':
            if (digitalTwinInstance && digitalTwinInstance.renderer) {
                digitalTwinInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'data-visualization':
            if (dataVisualizationInstance && dataVisualizationInstance.renderer) {
                dataVisualizationInstance.renderer.setAnimationLoop(null);
            }
            break;
    }
}

// Resume specific animation
function resumeAnimation(type) {
    switch (type) {
        case 'neural-network':
            if (neuralNetworkInstance && neuralNetworkInstance.renderer) {
                neuralNetworkInstance.renderer.setAnimationLoop(neuralNetworkInstance.animate);
            }
            break;
        case 'workflow-automation':
            if (workflowAutomationInstance && workflowAutomationInstance.renderer) {
                workflowAutomationInstance.renderer.setAnimationLoop(workflowAutomationInstance.animate);
            }
            break;
        case 'digital-twin':
            if (digitalTwinInstance && digitalTwinInstance.renderer) {
                digitalTwinInstance.renderer.setAnimationLoop(digitalTwinInstance.animate);
            }
            break;
        case 'data-visualization':
            if (dataVisualizationInstance && dataVisualizationInstance.renderer) {
                dataVisualizationInstance.renderer.setAnimationLoop(dataVisualizationInstance.animate);
            }
            break;
    }
}

// Expose animation instances and functions globally for debugging
window.threeAnimations = {
    neuralNetwork: () => neuralNetworkInstance,
    workflowAutomation: () => workflowAutomationInstance,
    digitalTwin: () => digitalTwinInstance,
    dataVisualization: () => dataVisualizationInstance,
    init: initAnimations,
    pause: pauseAnimation,
    resume: resumeAnimation
};

// Add resize listener to handle window resizing
window.addEventListener('resize', () => {
    if (neuralNetworkInstance) neuralNetworkInstance.onWindowResize();
    if (workflowAutomationInstance) workflowAutomationInstance.onWindowResize();
    if (digitalTwinInstance) digitalTwinInstance.onWindowResize();
    if (dataVisualizationInstance) dataVisualizationInstance.onWindowResize();
}); 