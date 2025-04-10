/**
 * CAAKE Website Performance Utilities
 * This utility provides performance optimization functions for animations and events
 */

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    let lastFunc;
    let lastRan;
    
    return function() {
        const context = this;
        const args = arguments;
        
        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Debounce function to delay execution until after a wait period
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @param {boolean} immediate - Whether to call the function immediately
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait, immediate) {
    let timeout;
    
    return function() {
        const context = this;
        const args = arguments;
        
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
}

/**
 * Create an optimized animation loop using requestAnimationFrame
 * @param {Function} callback - The animation callback function
 * @param {Object} options - Configuration options
 * @param {number} options.fps - Target frames per second (0 for unlimited)
 * @param {boolean} options.startImmediately - Whether to start the animation immediately
 * @returns {Object} - Animation controller with start, stop, and isRunning methods
 */
export function createAnimationLoop(callback, options = {}) {
    const {
        fps = 0,
        startImmediately = true
    } = options;
    
    let animationFrameId = null;
    let isRunning = false;
    let lastFrameTime = 0;
    const fpsInterval = fps > 0 ? 1000 / fps : 0;
    
    // Animation loop function
    function animate(timestamp) {
        if (!isRunning) return;
        
        animationFrameId = requestAnimationFrame(animate);
        
        // Calculate elapsed time
        const elapsed = timestamp - lastFrameTime;
        
        // If we're using FPS limiting and haven't reached the interval, skip this frame
        if (fpsInterval > 0 && elapsed < fpsInterval) return;
        
        // Calculate delta time in seconds
        const deltaTime = elapsed / 1000;
        
        // Remember the time of this frame
        lastFrameTime = timestamp - (elapsed % fpsInterval);
        
        // Call the animation callback with timestamp and delta time
        try {
            callback(timestamp, deltaTime);
        } catch (error) {
            console.error('Error in animation loop:', error);
            stop(); // Stop the animation if there's an error
        }
    }
    
    // Start the animation loop
    function start() {
        if (isRunning) return;
        
        isRunning = true;
        lastFrameTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
        return true;
    }
    
    // Stop the animation loop
    function stop() {
        if (!isRunning) return;
        
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        return true;
    }
    
    // Start immediately if requested
    if (startImmediately) {
        start();
    }
    
    // Return controller object
    return {
        start,
        stop,
        get isRunning() { return isRunning; }
    };
}

/**
 * Create an optimized resize handler
 * @param {Function} callback - The resize callback function
 * @param {Object} options - Configuration options
 * @param {number} options.debounceTime - Debounce time in milliseconds
 * @param {boolean} options.addEventListenerImmediately - Whether to add the event listener immediately
 * @returns {Object} - Resize handler with add, remove, and trigger methods
 */
export function createResizeHandler(callback, options = {}) {
    const {
        debounceTime = 250,
        addEventListenerImmediately = true
    } = options;
    
    // Create debounced resize handler
    const handleResize = debounce(() => {
        try {
            callback({
                width: window.innerWidth,
                height: window.innerHeight,
                aspectRatio: window.innerWidth / window.innerHeight
            });
        } catch (error) {
            console.error('Error in resize handler:', error);
        }
    }, debounceTime);
    
    // Add event listener
    function add() {
        window.addEventListener('resize', handleResize);
        return true;
    }
    
    // Remove event listener
    function remove() {
        window.removeEventListener('resize', handleResize);
        return true;
    }
    
    // Trigger resize handler manually
    function trigger() {
        handleResize();
        return true;
    }
    
    // Add event listener immediately if requested
    if (addEventListenerImmediately) {
        add();
    }
    
    // Return handler object
    return {
        add,
        remove,
        trigger
    };
}

/**
 * Create an optimized scroll handler
 * @param {Function} callback - The scroll callback function
 * @param {Object} options - Configuration options
 * @param {number} options.throttleTime - Throttle time in milliseconds
 * @param {boolean} options.addEventListenerImmediately - Whether to add the event listener immediately
 * @returns {Object} - Scroll handler with add, remove, and trigger methods
 */
export function createScrollHandler(callback, options = {}) {
    const {
        throttleTime = 100,
        addEventListenerImmediately = true
    } = options;
    
    // Create throttled scroll handler
    const handleScroll = throttle(() => {
        try {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollPercent = scrollTop / (scrollHeight - clientHeight);
            
            callback({
                scrollTop,
                scrollHeight,
                clientHeight,
                scrollPercent
            });
        } catch (error) {
            console.error('Error in scroll handler:', error);
        }
    }, throttleTime);
    
    // Add event listener
    function add() {
        window.addEventListener('scroll', handleScroll);
        return true;
    }
    
    // Remove event listener
    function remove() {
        window.removeEventListener('scroll', handleScroll);
        return true;
    }
    
    // Trigger scroll handler manually
    function trigger() {
        handleScroll();
        return true;
    }
    
    // Add event listener immediately if requested
    if (addEventListenerImmediately) {
        add();
    }
    
    // Return handler object
    return {
        add,
        remove,
        trigger
    };
}

// Export all functions as a module
export default {
    throttle,
    debounce,
    createAnimationLoop,
    createResizeHandler,
    createScrollHandler
};
