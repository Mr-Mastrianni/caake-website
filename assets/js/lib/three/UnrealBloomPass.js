/**
 * Simplified UnrealBloomPass for CAAKE website
 */

THREE.UnrealBloomPass = function(resolution, strength, radius, threshold) {
    this.resolution = resolution;
    this.strength = strength;
    this.radius = radius;
    this.threshold = threshold;
};
