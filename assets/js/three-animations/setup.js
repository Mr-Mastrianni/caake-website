// Three.js Core Setup and Utilities
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/ShaderPass.js';

class ThreeJSSetup {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.options = options;
        
        // Initialize core components
        this.initScene();
        this.initCamera();
        this.initRenderer();
        this.initControls();
        
        // Set up post-processing if needed
        if (options.postprocessing) {
            this.initPostprocessing();
        }
        
        // Set up event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Animation loop
        this.animate = this.animate.bind(this);
        this.clock = new THREE.Clock();
    }
    
    initScene() {
        this.scene = new THREE.Scene();
        if (this.options.backgroundColor) {
            this.scene.background = new THREE.Color(this.options.backgroundColor);
        }
        
        // Add fog for depth
        if (this.options.fog) {
            this.scene.fog = new THREE.FogExp2(0x000000, 0.001);
        }
    }
    
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            this.options.fov || 75,
            this.width / this.height,
            this.options.near || 0.1,
            this.options.far || 1000
        );
        this.camera.position.set(
            this.options.cameraX || 0,
            this.options.cameraY || 0,
            this.options.cameraZ || 5
        );
    }
    
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: this.options.transparent || false
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);
        
        // Enable shadows if needed
        if (this.options.shadows) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
    }
    
    initControls() {
        if (this.options.orbitControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            
            if (this.options.controlsConfig) {
                Object.assign(this.controls, this.options.controlsConfig);
            }
        }
    }
    
    initPostprocessing() {
        this.composer = new EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom effect
        if (this.options.bloom) {
            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(this.width, this.height),
                this.options.bloomStrength || 1.5,
                this.options.bloomRadius || 0.4,
                this.options.bloomThreshold || 0.85
            );
            this.composer.addPass(bloomPass);
        }
        
        // Store passes for later reference
        this.passes = {
            renderPass
        };
    }
    
    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
        
        if (this.composer) {
            this.composer.setSize(this.width, this.height);
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
        if (this.update) {
            this.update(delta, elapsedTime);
        }
        
        // Render scene
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
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
        const loader = new THREE.TextureLoader();
        return loader.load(path, callback);
    }
    
    // Clean up resources when disposing
    dispose() {
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        
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