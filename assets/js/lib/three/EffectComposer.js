/**
 * Simplified EffectComposer for CAAKE website
 */

THREE.EffectComposer = function(renderer) {
    this.renderer = renderer;
    this.passes = [];
    
    this.addPass = function(pass) {
        this.passes.push(pass);
    };
    
    this.setSize = function(width, height) {
        // In a real implementation, this would resize all passes
    };
    
    this.render = function() {
        // In a real implementation, this would render all passes
        // For our purposes, we'll just call the renderer's render method
        if (this.renderer && this.renderer.render) {
            this.renderer.render();
        }
    };
};
