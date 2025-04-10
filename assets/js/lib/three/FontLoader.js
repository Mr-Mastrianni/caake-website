/**
 * Simplified FontLoader for CAAKE website
 */

THREE.FontLoader = function() {
    this.load = function(url, onLoad) {
        // Simulate loading a font
        setTimeout(function() {
            const font = {
                generateShapes: function(text, size) {
                    return [];
                }
            };
            if (onLoad) onLoad(font);
        }, 100);
    };
};
