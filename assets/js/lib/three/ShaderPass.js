/**
 * Simplified ShaderPass for CAAKE website
 */

THREE.ShaderPass = function(shader, textureID) {
    this.textureID = textureID || "tDiffuse";
    this.uniforms = shader.uniforms;
    this.material = {
        uniforms: this.uniforms
    };
};
