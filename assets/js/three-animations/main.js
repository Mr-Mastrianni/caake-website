import NeuralNetworkAnimation from './neural-network.js';
import WorkflowAutomationAnimation from './workflow-automation.js';
import DigitalTwinAnimation from './digital-twin.js';
import DataVisualizationAnimation from './data-visualization.js';
import AIBrainAnimation from './ai-brain.js';
import MachineLearningCubeAnimation from './machine-learning-cube.js';
import AIVoiceWaveformAnimation from './ai-voice-waveform.js';
import HealthcareVisualization from './healthcare-visualization.js';
import BusinessAutomationAnimation from './business-automation.js';
import DataFlowNetworkAnimation from './data-flow-network.js';
import AIKnowledgeSpheresAnimation from './ai-knowledge-spheres.js';
import ZedStyleAnimation from './zed-style-animation.js';

// Initialize animations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing animations...');
        initAnimations();
    } catch (error) {
        console.error('Error initializing animations:', error);
        // Graceful fallback - hide animation containers and show static content
        document.querySelectorAll('[data-animation]').forEach(element => {
            element.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #000000 100%)';
            const container = element.querySelector('.animation-container');
            if (container) {
                container.style.display = 'none';
            }
        });
    }
});

// Animation instances
let neuralNetworkInstance = null;
let workflowAutomationInstance = null;
let digitalTwinInstance = null;
let dataVisualizationInstance = null;
let aiBrainInstance = null;
let machineLearningCubeInstance = null;
let aiVoiceWaveformInstance = null;
let healthcareVisualizationInstance = null;
let businessAutomationInstance = null;
let dataFlowNetworkInstance = null;
let aiKnowledgeSpheresInstance = null;
let zedStyleInstance = null;

// Initialization function
function initAnimations() {
    try {
        // Initialize animations on elements with specific data attributes
        initAnimationByType('neural-network');
        initAnimationByType('workflow-automation');
        initAnimationByType('digital-twin');
        initAnimationByType('data-visualization');
        initAnimationByType('ai-brain');
        initAnimationByType('machine-learning-cube');
        initAnimationByType('ai-voice-waveform');
        initAnimationByType('healthcare-visualization');
        initAnimationByType('business-automation');
        initAnimationByType('data-flow-network');
        initAnimationByType('ai-knowledge-spheres');
        initAnimationByType('zed-style');

        // Set up scroll-based animation visibility
        setupScrollObserver();
    } catch (error) {
        console.error('Error during animation initialization:', error);
    }
}

// Initialize specific animation type
function initAnimationByType(type) {
    const elements = document.querySelectorAll(`[data-animation="${type}"]`);

    elements.forEach(element => {
        try {
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
                // Ensure animation container doesn't block interaction
                container.style.pointerEvents = 'none';
                container.id = `${type}-container-${Math.floor(Math.random() * 10000)}`;

                // Ensure container is the first child to not interfere with content
                if (element.firstChild) {
                    element.insertBefore(container, element.firstChild);
                } else {
                    element.appendChild(container);
                }

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
                    case 'ai-brain':
                        aiBrainInstance = new AIBrainAnimation(container.id, options);
                        break;
                    case 'machine-learning-cube':
                        machineLearningCubeInstance = new MachineLearningCubeAnimation(container.id, options);
                        break;
                    case 'ai-voice-waveform':
                        aiVoiceWaveformInstance = new AIVoiceWaveformAnimation(container.id, options);
                        break;
                    case 'healthcare-visualization':
                        healthcareVisualizationInstance = new HealthcareVisualization(container.id, options);
                        break;
                    case 'business-automation':
                        businessAutomationInstance = new BusinessAutomationAnimation(container.id, options);
                        break;
                    case 'data-flow-network':
                        dataFlowNetworkInstance = new DataFlowNetworkAnimation(container.id, options);
                        break;
                    case 'ai-knowledge-spheres':
                        aiKnowledgeSpheresInstance = new AIKnowledgeSpheresAnimation(container.id, options);
                        break;
                    case 'zed-style':
                        zedStyleInstance = new ZedStyleAnimation(container.id, options);
                        break;
                }

                console.log(`Initialized ${type} animation`);
            }
        } catch (error) {
            console.error(`Error initializing ${type} animation:`, error);
            // Apply fallback styling
            element.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #000000 100%)';
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
        case 'ai-brain':
            if (aiBrainInstance && aiBrainInstance.renderer) {
                aiBrainInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'machine-learning-cube':
            if (machineLearningCubeInstance && machineLearningCubeInstance.renderer) {
                machineLearningCubeInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'ai-voice-waveform':
            if (aiVoiceWaveformInstance && aiVoiceWaveformInstance.renderer) {
                aiVoiceWaveformInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'healthcare-visualization':
            if (healthcareVisualizationInstance && healthcareVisualizationInstance.renderer) {
                healthcareVisualizationInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'business-automation':
            if (businessAutomationInstance && businessAutomationInstance.renderer) {
                businessAutomationInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'data-flow-network':
            if (dataFlowNetworkInstance && dataFlowNetworkInstance.renderer) {
                dataFlowNetworkInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'ai-knowledge-spheres':
            if (aiKnowledgeSpheresInstance && aiKnowledgeSpheresInstance.renderer) {
                aiKnowledgeSpheresInstance.renderer.setAnimationLoop(null);
            }
            break;
        case 'zed-style':
            if (zedStyleInstance && zedStyleInstance.renderer) {
                zedStyleInstance.renderer.setAnimationLoop(null);
            }
            break;
    }
}

// Resume specific animation
function resumeAnimation(type) {
    switch (type) {
        case 'neural-network':
            if (neuralNetworkInstance && neuralNetworkInstance.renderer) {
                neuralNetworkInstance.renderer.setAnimationLoop(neuralNetworkInstance.animate.bind(neuralNetworkInstance));
            }
            break;
        case 'workflow-automation':
            if (workflowAutomationInstance && workflowAutomationInstance.renderer) {
                workflowAutomationInstance.renderer.setAnimationLoop(workflowAutomationInstance.animate.bind(workflowAutomationInstance));
            }
            break;
        case 'digital-twin':
            if (digitalTwinInstance && digitalTwinInstance.renderer) {
                digitalTwinInstance.renderer.setAnimationLoop(digitalTwinInstance.animate.bind(digitalTwinInstance));
            }
            break;
        case 'data-visualization':
            if (dataVisualizationInstance && dataVisualizationInstance.renderer) {
                dataVisualizationInstance.renderer.setAnimationLoop(dataVisualizationInstance.animate.bind(dataVisualizationInstance));
            }
            break;
        case 'ai-brain':
            if (aiBrainInstance && aiBrainInstance.renderer) {
                aiBrainInstance.renderer.setAnimationLoop(aiBrainInstance.animate.bind(aiBrainInstance));
            }
            break;
        case 'machine-learning-cube':
            if (machineLearningCubeInstance && machineLearningCubeInstance.renderer) {
                machineLearningCubeInstance.renderer.setAnimationLoop(machineLearningCubeInstance.animate.bind(machineLearningCubeInstance));
            }
            break;
        case 'ai-voice-waveform':
            if (aiVoiceWaveformInstance && aiVoiceWaveformInstance.renderer) {
                aiVoiceWaveformInstance.renderer.setAnimationLoop(aiVoiceWaveformInstance.animate.bind(aiVoiceWaveformInstance));
            }
            break;
        case 'healthcare-visualization':
            if (healthcareVisualizationInstance && healthcareVisualizationInstance.renderer) {
                healthcareVisualizationInstance.renderer.setAnimationLoop(healthcareVisualizationInstance.animate.bind(healthcareVisualizationInstance));
            }
            break;
        case 'business-automation':
            if (businessAutomationInstance && businessAutomationInstance.renderer) {
                businessAutomationInstance.renderer.setAnimationLoop(businessAutomationInstance.animate.bind(businessAutomationInstance));
            }
            break;
        case 'data-flow-network':
            if (dataFlowNetworkInstance && dataFlowNetworkInstance.renderer) {
                dataFlowNetworkInstance.renderer.setAnimationLoop(dataFlowNetworkInstance.animate.bind(dataFlowNetworkInstance));
            }
            break;
        case 'ai-knowledge-spheres':
            if (aiKnowledgeSpheresInstance && aiKnowledgeSpheresInstance.renderer) {
                aiKnowledgeSpheresInstance.renderer.setAnimationLoop(aiKnowledgeSpheresInstance.animate.bind(aiKnowledgeSpheresInstance));
            }
            break;
        case 'zed-style':
            if (zedStyleInstance && zedStyleInstance.renderer) {
                zedStyleInstance.renderer.setAnimationLoop(zedStyleInstance.animate.bind(zedStyleInstance));
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
    aiBrain: () => aiBrainInstance,
    machineLearningCube: () => machineLearningCubeInstance,
    aiVoiceWaveform: () => aiVoiceWaveformInstance,
    healthcareVisualization: () => healthcareVisualizationInstance,
    businessAutomation: () => businessAutomationInstance,
    zedStyle: () => zedStyleInstance,
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
    if (aiBrainInstance) aiBrainInstance.onWindowResize();
    if (machineLearningCubeInstance) machineLearningCubeInstance.onWindowResize();
    if (aiVoiceWaveformInstance) aiVoiceWaveformInstance.onWindowResize();
    if (healthcareVisualizationInstance) healthcareVisualizationInstance.onWindowResize();
    if (businessAutomationInstance) businessAutomationInstance.onWindowResize();
});