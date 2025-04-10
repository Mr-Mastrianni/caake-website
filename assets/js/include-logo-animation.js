/**
 * CAAKE 3D Logo Animation Initializer
 * This file can be included in any page to add the 3D logo animation
 */

// Load required CSS
function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/logo-animation.css';
    document.head.appendChild(link);
}

// Load the logo animation script
function loadLogoScript() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'assets/js/logo-animation.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize logo in navbar
function initNavbarLogo() {
    // Find the logo container in the navbar
    const logoContainer = document.querySelector('.logo');
    
    if (logoContainer) {
        // Create a container for the 3D logo
        const logoAnimationContainer = document.createElement('div');
        logoAnimationContainer.id = 'navbar-logo-3d';
        logoAnimationContainer.className = 'logo-3d-container logo-navbar';
        
        // Add loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'logo-loading';
        loadingIndicator.textContent = 'Loading...';
        logoAnimationContainer.appendChild(loadingIndicator);
        
        // Replace the existing logo with the 3D logo container
        const existingLogo = logoContainer.querySelector('img');
        if (existingLogo) {
            logoContainer.insertBefore(logoAnimationContainer, existingLogo);
            existingLogo.style.display = 'none';
        } else {
            logoContainer.appendChild(logoAnimationContainer);
        }
        
        // Initialize the 3D logo animation
        import('./logo-animation.js').then(module => {
            const initLogoAnimation = module.default;
            initLogoAnimation('navbar-logo-3d');
        });
    }
}

// Initialize logo in hero section
function initHeroLogo() {
    // Find the hero section
    const heroSection = document.querySelector('.hero, .hero-section, header');
    
    if (heroSection) {
        // Create a container for the 3D logo
        const logoAnimationContainer = document.createElement('div');
        logoAnimationContainer.id = 'hero-logo-3d';
        logoAnimationContainer.className = 'logo-3d-container logo-hero';
        
        // Add loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'logo-loading';
        loadingIndicator.textContent = 'Loading...';
        logoAnimationContainer.appendChild(loadingIndicator);
        
        // Add the logo container to the hero section
        heroSection.appendChild(logoAnimationContainer);
        
        // Initialize the 3D logo animation
        import('./logo-animation.js').then(module => {
            const initLogoAnimation = module.default;
            initLogoAnimation('hero-logo-3d');
        });
    }
}

// Initialize background logo
function initBackgroundLogo() {
    // Create a container for the background 3D logo
    const logoAnimationContainer = document.createElement('div');
    logoAnimationContainer.id = 'background-logo-3d';
    logoAnimationContainer.className = 'logo-3d-container logo-fullscreen';
    logoAnimationContainer.style.opacity = '0.15';
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'logo-loading';
    loadingIndicator.textContent = 'Loading...';
    logoAnimationContainer.appendChild(loadingIndicator);
    
    // Add the logo container to the body
    document.body.appendChild(logoAnimationContainer);
    
    // Initialize the 3D logo animation
    import('./logo-animation.js').then(module => {
        const initLogoAnimation = module.default;
        initLogoAnimation('background-logo-3d');
    });
}

// Initialize all logo animations
function initAllLogoAnimations() {
    loadCSS();
    
    // Check if we should initialize different logo placements
    const urlParams = new URLSearchParams(window.location.search);
    const initNavbar = urlParams.get('navbar-logo') !== 'false';
    const initHero = urlParams.get('hero-logo') !== 'false';
    const initBackground = urlParams.get('background-logo') === 'true';
    
    if (initNavbar) {
        initNavbarLogo();
    }
    
    if (initHero) {
        initHeroLogo();
    }
    
    if (initBackground) {
        initBackgroundLogo();
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAllLogoAnimations);

// Export functions for manual initialization
export {
    initNavbarLogo,
    initHeroLogo,
    initBackgroundLogo
};
