// Three.js Core Setup and Utilities
// Imports are handled by module-loader.js and made global
// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
// import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { throttle } from '../utils/performance.js'; // Import throttle
import { handleError } from '../utils/error-handler.js'; // Import handleError

class ThreeJSSetup {
    constructor(containerId, options = {}) {
        try { // Wrap constructor
            this.container = document.getElementById(containerId);
            
            if (!this.container) {
                // Use handleError for consistent reporting
                handleError(new Error(`Container element with ID ${containerId} not found.`), 'ThreeJSSetup Initialization');
                return; // Stop execution if container not found
            }
            
            // Default options
            this.options = {
                backgroundColor: options.backgroundColor || 0x000000,
                transparent: options.transparent !== undefined ? options.transparent : true,
                orbitControls: options.orbitControls !== undefined ? options.orbitControls : true,
                postprocessing: options.postprocessing !== undefined ? options.postprocessing : false,
                bloom: options.bloom !== undefined ? options.bloom : false,
                bloomStrength: options.bloomStrength || 1.5,
                bloomRadius: options.bloomRadius || 0.4,
                bloomThreshold: options.bloomThreshold || 0.8,
                cameraZ: options.cameraZ || 100,
                controlsConfig: options.controlsConfig || {}
            };
            
            // Setup
            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            
            // Make sure animation container doesn't interfere with scroll
            this.container.style.position = 'absolute';
            this.container.style.pointerEvents = 'none';
            
            if (this.options.orbitControls) {
                this.setupOrbitControls();
            }
            
            if (this.options.postprocessing) {
                this.setupPostprocessing();
            }
            
            // Handle resize
            // Throttle the resize event to improve performance (e.g., call max once per 250ms)
            this.throttledResize = throttle(this.onWindowResize.bind(this), 250);
            window.addEventListener('resize', this.throttledResize);
            
            // Initial resize
            this.onWindowResize();
            
            // Animation loop
            this.animate = this.animate.bind(this);
            this.clock = new THREE.Clock();
        } catch (error) {
            handleError(error, 'Error during ThreeJSSetup construction');
            // Optionally trigger fallback behavior
        }
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        if (this.options.backgroundColor) {
            this.scene.background = new THREE.Color(this.options.backgroundColor);
        }
        
        // Add fog for depth
        if (this.options.fog) {
            this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
        }
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, this.options.cameraZ);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: this.options.transparent || false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        
        // Enable shadows if needed
        if (this.options.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
    }
    
    setupOrbitControls() {
        try { // Wrap setup method
            // Access THREE and OrbitControls from the global scope
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            
            if (this.options.controlsConfig) {
                Object.assign(this.controls, this.options.controlsConfig);
            }
        } catch (error) {
            handleError(error, 'Error setting up OrbitControls');
        }
    }
    
    setupPostprocessing() {
        try { // Wrap setup method
            // Access THREE, EffectComposer, RenderPass, UnrealBloomPass from the global scope
            this.composer = new EffectComposer(this.renderer);
            
            // Add render pass
            const renderPass = new RenderPass(this.scene, this.camera);
            this.composer.addPass(renderPass);
            
            // Add bloom effect
            if (this.options.bloom) {
                const bloomPass = new UnrealBloomPass(
                    new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
                    this.options.bloomStrength,
                    this.options.bloomRadius,
                    this.options.bloomThreshold
                );
                this.composer.addPass(bloomPass);
            }
            
            // Store passes for later reference
            this.passes = {
                renderPass
            };
            // TODO: Add other passes if needed (e.g., ShaderPass)
        } catch (error) {
            handleError(error, 'Error setting up Postprocessing');
        }
    }
    
    onWindowResize() {
        // Check if container exists
        if (!this.container) return;

        this.container.style.width = this.container.clientWidth + 'px';
        this.container.style.height = this.container.clientHeight + 'px';
        
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        
        if (this.composer) {
            this.composer.setSize(this.container.clientWidth, this.container.clientHeight);
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate);
        
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        // Update controls if they exist
        if (this.controls) {
            this.controls.update();
        }
        
        // Call custom update function if provided
        try {
            if (this.update) { // Ensure update exists before calling
                 this.update(delta, elapsedTime);
            }
        } catch (error) {
            // Use handleError for consistent reporting
            handleError(error, 'Error in custom update function');
            this.dispose(); // Stop animation on error
        }
        
        // Render scene
        try { // Wrap rendering
            if (this.composer) {
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        } catch (error) {
            handleError(error, 'Error during rendering');
            this.dispose(); // Stop animation on error
        }
    }
    
    // Helper for creating lights
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
        
        // Point light
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
        
        return {
            ambientLight,
            directionalLight,
            pointLight
        };
    }
    
    // Helper for creating basic geometries
    createGeometry(type, params = {}) {
        switch(type) {
            case 'box':
                return new THREE.BoxGeometry(
                    params.width || 1,
                    params.height || 1,
                    params.depth || 1
                );
            case 'sphere':
                return new THREE.SphereGeometry(
                    params.radius || 1,
                    params.widthSegments || 32,
                    params.heightSegments || 32
                );
            case 'plane':
                return new THREE.PlaneGeometry(
                    params.width || 10,
                    params.height || 10
                );
            default:
                return new THREE.BoxGeometry(1, 1, 1);
        }
    }
    
    // Helper for creating materials
    createMaterial(type, params = {}) {
        switch(type) {
            case 'basic':
                return new THREE.MeshBasicMaterial(params);
            case 'standard':
                return new THREE.MeshStandardMaterial(params);
            case 'phong':
                return new THREE.MeshPhongMaterial(params);
            case 'toon':
                return new THREE.MeshToonMaterial(params);
            case 'physical':
                return new THREE.MeshPhysicalMaterial(params);
            default:
                return new THREE.MeshStandardMaterial(params);
        }
    }
    
    // Helper for loading textures
    loadTexture(path, callback) {
        // Access THREE.TextureLoader from the global scope
        const loader = new THREE.TextureLoader();
        return loader.load(path, callback);
    }
    
    // Clean up resources when disposing
    dispose() {
        // Remove event listener
        window.removeEventListener('resize', this.throttledResize); // Use the throttled function reference
        
        // Dispose of geometries and materials
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        
        // Remove renderer
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
}

export default ThreeJSSetup; 