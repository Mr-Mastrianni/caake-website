/**
 * Simplified TextGeometry for CAAKE website
 */

THREE.TextGeometry = function(text, parameters) {
    this.parameters = parameters;
    this.text = text;
    
    this.center = function() {
        // In a real implementation, this would center the geometry
    };
};
