import AIConceptMorphAnimation from './ai-concept-morph.js';

// Initialize anime.js animations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing Anime.js animations...');
        initAnimeAnimations();
    } catch (error) {
        console.error('Error initializing Anime.js animations:', error);
        // Graceful fallback - apply static background
        document.querySelectorAll('[data-anime-animation]').forEach(element => {
            element.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #000000 100%)';
        });
    }
});

// Animation instances
const animationInstances = new Map();

// Initialization function
function initAnimeAnimations() {
    try {
        // Initialize AIConceptMorph animation
        initAnimationByType('ai-concept-morph');
        
        // Set up scroll-based animation visibility
        setupScrollObserver();
    } catch (error) {
        console.error('Error during Anime.js animation initialization:', error);
    }
}

// Initialize specific animation type
function initAnimationByType(type) {
    const elements = document.querySelectorAll(`[data-anime-animation="${type}"]`);

    elements.forEach(element => {
        try {
            // Get animation options from data attributes
            const options = getOptionsFromDataAttributes(element);
            
            // Get or generate container ID
            let containerId = element.id;
            if (!containerId) {
                containerId = `${type}-container-${Math.floor(Math.random() * 10000)}`;
                element.id = containerId;
            }
            
            // Initialize animation based on type
            let animationInstance;
            
            switch (type) {
                case 'ai-concept-morph':
                    animationInstance = new AIConceptMorphAnimation(containerId, options);
                    break;
                
                // Add other anime.js animations here
                
                default:
                    console.warn(`Unknown animation type: ${type}`);
                    return;
            }
            
            // Store animation instance for later reference
            animationInstances.set(containerId, animationInstance);
            
            console.log(`Initialized ${type} animation on ${containerId}`);
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

    const animationElements = document.querySelectorAll('[data-anime-animation]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const containerId = entry.target.id;
            const animationInstance = animationInstances.get(containerId);
            
            if (!animationInstance) return;
            
            if (entry.isIntersecting) {
                // Play/resume animation when in viewport
                if (animationInstance.play && typeof animationInstance.play === 'function') {
                    animationInstance.play();
                }
            } else {
                // Pause animation when out of viewport
                if (animationInstance.pause && typeof animationInstance.pause === 'function') {
                    animationInstance.pause();
                }
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

// Export functions for potential external use
export {
    initAnimeAnimations,
    animationInstances
}; 