/**
 * CAAKE Website Error Handling Utility
 * This utility provides standardized error handling and fallback mechanisms
 */

/**
 * Error types for categorization
 */
export const ErrorTypes = {
    ANIMATION: 'animation',
    LOADING: 'loading',
    RENDERING: 'rendering',
    NETWORK: 'network',
    UNKNOWN: 'unknown'
};

/**
 * Error severity levels
 */
export const ErrorSeverity = {
    CRITICAL: 'critical',   // Application cannot continue
    ERROR: 'error',         // Feature cannot function
    WARNING: 'warning',     // Feature degraded but functional
    INFO: 'info'            // Informational only
};

/**
 * Create a standardized error object
 * @param {string} message - Error message
 * @param {Object} options - Error options
 * @param {string} options.type - Error type from ErrorTypes
 * @param {string} options.severity - Error severity from ErrorSeverity
 * @param {Error} options.originalError - Original error object if available
 * @param {Object} options.context - Additional context information
 * @returns {Object} - Standardized error object
 */
export function createError(message, options = {}) {
    const {
        type = ErrorTypes.UNKNOWN,
        severity = ErrorSeverity.ERROR,
        originalError = null,
        context = {}
    } = options;
    
    return {
        message,
        type,
        severity,
        timestamp: new Date().toISOString(),
        originalError,
        context,
        stack: originalError ? originalError.stack : new Error().stack
    };
}

/**
 * Global error handler
 * @param {Object} error - Error object from createError
 * @param {Object} options - Handler options
 * @param {boolean} options.logToConsole - Whether to log to console
 * @param {Function} options.onError - Custom error handler
 */
export function handleError(error, options = {}) {
    const {
        logToConsole = true,
        onError = null
    } = options;
    
    // Log to console if requested
    if (logToConsole) {
        const consoleMethod = error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.ERROR
            ? console.error
            : error.severity === ErrorSeverity.WARNING
                ? console.warn
                : console.info;
        
        consoleMethod(`[${error.type.toUpperCase()}] ${error.message}`, error);
    }
    
    // Call custom error handler if provided
    if (typeof onError === 'function') {
        try {
            onError(error);
        } catch (err) {
            console.error('Error in custom error handler:', err);
        }
    }
    
    // Return the error for chaining
    return error;
}

/**
 * Create a fallback element for when animations or content fails to load
 * @param {string} containerId - ID of the container element
 * @param {Object} options - Fallback options
 * @param {string} options.message - Fallback message
 * @param {string} options.type - Type of fallback (text, image, etc.)
 * @param {string} options.className - Additional CSS class for styling
 * @returns {HTMLElement} - The created fallback element
 */
export function createFallbackElement(containerId, options = {}) {
    const {
        message = 'Content could not be loaded',
        type = 'text',
        className = ''
    } = options;
    
    // Get the container element
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found`);
        return null;
    }
    
    // Clear the container
    container.innerHTML = '';
    
    // Create fallback element
    const fallbackElement = document.createElement('div');
    fallbackElement.className = `fallback-element fallback-${type} ${className}`;
    
    // Create content based on type
    switch (type) {
        case 'image':
            const img = document.createElement('img');
            img.src = options.imageSrc || 'assets/images/fallback.png';
            img.alt = message;
            fallbackElement.appendChild(img);
            
            const caption = document.createElement('p');
            caption.textContent = message;
            fallbackElement.appendChild(caption);
            break;
            
        case 'icon':
            const icon = document.createElement('i');
            icon.className = options.iconClass || 'fas fa-exclamation-circle';
            fallbackElement.appendChild(icon);
            
            const text = document.createElement('p');
            text.textContent = message;
            fallbackElement.appendChild(text);
            break;
            
        case 'text':
        default:
            fallbackElement.textContent = message;
            break;
    }
    
    // Add to container
    container.appendChild(fallbackElement);
    
    // Return the created element
    return fallbackElement;
}

/**
 * Try to execute a function with error handling
 * @param {Function} func - Function to execute
 * @param {Object} options - Options for error handling
 * @param {Function} options.fallback - Fallback function to execute on error
 * @param {Object} options.errorOptions - Options for error creation
 * @param {Object} options.handlerOptions - Options for error handling
 * @returns {*} - Result of the function or fallback
 */
export function tryCatch(func, options = {}) {
    const {
        fallback = null,
        errorOptions = {},
        handlerOptions = {}
    } = options;
    
    try {
        return func();
    } catch (err) {
        // Create and handle error
        const error = createError(
            errorOptions.message || err.message,
            {
                originalError: err,
                ...errorOptions
            }
        );
        
        handleError(error, handlerOptions);
        
        // Execute fallback if provided
        if (typeof fallback === 'function') {
            try {
                return fallback(error);
            } catch (fallbackErr) {
                console.error('Error in fallback function:', fallbackErr);
            }
        }
        
        // Re-throw if no fallback
        if (fallback === null) {
            throw err;
        }
        
        // Return fallback value
        return fallback;
    }
}

// Export all functions as a module
export default {
    ErrorTypes,
    ErrorSeverity,
    createError,
    handleError,
    createFallbackElement,
    tryCatch
};
