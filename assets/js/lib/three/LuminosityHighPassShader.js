/**
 * Simplified LuminosityHighPassShader for CAAKE website
 */

THREE.LuminosityHighPassShader = {
    uniforms: {
        tDiffuse: { value: null },
        luminosityThreshold: { value: 1.0 },
        smoothWidth: { value: 1.0 },
        defaultColor: { value: new THREE.Color(0x000000) },
        defaultOpacity: { value: 0.0 }
    }
};
