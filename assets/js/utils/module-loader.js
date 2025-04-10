/**
 * CAAKE Website Module Loader Utility
 * This utility provides standardized loading of external libraries and modules
 */

// Standard Three.js version to use across the site
const THREE_VERSION = '0.132.2';

/**
 * Load Three.js and its modules
 * @param {Object} options - Configuration options
 * @param {boolean} options.useGlobal - Whether to make THREE available globally
 * @param {Array<string>} options.addons - Additional Three.js addons to load
 * @param {Function} options.onLoad - Callback function when loading is complete
 * @param {Function} options.onError - Callback function when loading fails
 * @returns {Promise} - Promise that resolves when loading is complete
 */
export function loadThreeJS(options = {}) {
    const {
        useGlobal = true,
        addons = [],
        onLoad = () => {},
        onError = (err) => console.error('Error loading Three.js:', err)
    } = options;

    return new Promise((resolve, reject) => {
        try {
            // Check if THREE is already defined
            if (window.THREE && useGlobal) {
                console.log('THREE.js already loaded globally');
                onLoad(window.THREE);
                resolve(window.THREE);
                return;
            }

            // Import Three.js core
            import(`https://unpkg.com/three@${THREE_VERSION}/build/three.module.js`)
                .then(threeModule => {
                    // Make THREE available globally if requested
                    if (useGlobal) {
                        window.THREE = threeModule;
                    }

                    // Load addons if specified
                    const addonPromises = addons.map(addon => {
                        return import(`https://unpkg.com/three@${THREE_VERSION}/examples/jsm/${addon}.js`);
                    });

                    // Wait for all addons to load
                    return Promise.all(addonPromises)
                        .then(addonModules => {
                            const result = {
                                THREE: threeModule,
                                addons: addonModules
                            };
                            onLoad(result);
                            resolve(result);
                        });
                })
                .catch(err => {
                    console.error('Failed to load Three.js:', err);
                    onError(err);
                    reject(err);
                });
        } catch (err) {
            console.error('Error in loadThreeJS:', err);
            onError(err);
            reject(err);
        }
    });
}

/**
 * Load Anime.js
 * @param {Object} options - Configuration options
 * @param {boolean} options.useGlobal - Whether to make anime available globally
 * @param {Function} options.onLoad - Callback function when loading is complete
 * @param {Function} options.onError - Callback function when loading fails
 * @returns {Promise} - Promise that resolves when loading is complete
 */
export function loadAnimeJS(options = {}) {
    const {
        useGlobal = true,
        onLoad = () => {},
        onError = (err) => console.error('Error loading Anime.js:', err)
    } = options;

    return new Promise((resolve, reject) => {
        try {
            // Check if anime is already defined
            if (window.anime && useGlobal) {
                console.log('Anime.js already loaded globally');
                onLoad(window.anime);
                resolve(window.anime);
                return;
            }

            // Import Anime.js
            import('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js')
                .then(animeModule => {
                    // Make anime available globally if requested
                    if (useGlobal && !window.anime) {
                        window.anime = animeModule.default;
                    }
                    onLoad(animeModule.default);
                    resolve(animeModule.default);
                })
                .catch(err => {
                    // Fallback to script tag loading if import fails
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
                    script.onload = () => {
                        onLoad(window.anime);
                        resolve(window.anime);
                    };
                    script.onerror = (e) => {
                        const error = new Error('Failed to load Anime.js via script tag');
                        onError(error);
                        reject(error);
                    };
                    document.head.appendChild(script);
                });
        } catch (err) {
            console.error('Error in loadAnimeJS:', err);
            onError(err);
            reject(err);
        }
    });
}

/**
 * Load any external script
 * @param {string} url - URL of the script to load
 * @param {Object} options - Configuration options
 * @param {boolean} options.async - Whether to load the script asynchronously
 * @param {boolean} options.defer - Whether to defer loading the script
 * @param {Function} options.onLoad - Callback function when loading is complete
 * @param {Function} options.onError - Callback function when loading fails
 * @returns {Promise} - Promise that resolves when loading is complete
 */
export function loadScript(url, options = {}) {
    const {
        async = true,
        defer = true,
        onLoad = () => {},
        onError = (err) => console.error(`Error loading script ${url}:`, err)
    } = options;

    return new Promise((resolve, reject) => {
        try {
            // Check if script is already loaded
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (existingScript) {
                console.log(`Script ${url} already loaded`);
                onLoad();
                resolve();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = url;
            script.async = async;
            script.defer = defer;
            
            script.onload = () => {
                onLoad();
                resolve();
            };
            
            script.onerror = (e) => {
                const error = new Error(`Failed to load script: ${url}`);
                onError(error);
                reject(error);
            };
            
            document.head.appendChild(script);
        } catch (err) {
            console.error(`Error loading script ${url}:`, err);
            onError(err);
            reject(err);
        }
    });
}

/**
 * Load CSS file
 * @param {string} url - URL of the CSS file to load
 * @param {Object} options - Configuration options
 * @param {Function} options.onLoad - Callback function when loading is complete
 * @param {Function} options.onError - Callback function when loading fails
 * @returns {Promise} - Promise that resolves when loading is complete
 */
export function loadCSS(url, options = {}) {
    const {
        onLoad = () => {},
        onError = (err) => console.error(`Error loading CSS ${url}:`, err)
    } = options;

    return new Promise((resolve, reject) => {
        try {
            // Check if CSS is already loaded
            const existingLink = document.querySelector(`link[href="${url}"]`);
            if (existingLink) {
                console.log(`CSS ${url} already loaded`);
                onLoad();
                resolve();
                return;
            }

            // Create link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            
            link.onload = () => {
                onLoad();
                resolve();
            };
            
            link.onerror = (e) => {
                const error = new Error(`Failed to load CSS: ${url}`);
                onError(error);
                reject(error);
            };
            
            document.head.appendChild(link);
        } catch (err) {
            console.error(`Error loading CSS ${url}:`, err);
            onError(err);
            reject(err);
        }
    });
}

// Export all functions as a module
export default {
    loadThreeJS,
    loadAnimeJS,
    loadScript,
    loadCSS,
    THREE_VERSION
};
