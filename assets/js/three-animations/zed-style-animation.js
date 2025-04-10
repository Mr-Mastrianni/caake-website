/**
 * CAAKE Website - Zed-Style 3D Animation
 * This file implements a futuristic 3D animation inspired by the zed design
 * Uses Three.js for 3D rendering and GSAP for animations
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/postprocessing/ShaderPass.js';

class ZedStyleAnimation {
    constructor(containerId, options = {}) {
        // Default options
        this.options = Object.assign({
            backgroundColor: 0x0a0a12,
            wireframeColor: 0x5773ff,
            glowColor: 0x00f0ff,
            accentColor: 0xff007a,
            bloomStrength: 1.5,
            bloomRadius: 0.75,
            bloomThreshold: 0.2,
            rotationSpeed: 0.005,
            interactive: true,
            mouseFollowIntensity: 0.1,
            enableOrbitControls: false,
            enableVanta: true,
            vantaEffect: 'globe', // 'globe', 'net', 'waves', 'dots'
            objectsToRender: ['torus', 'cube', 'pyramid', 'particles'] // Which objects to include
        }, options);

        // Get container
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        // Set container style
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        
        // Initialize
        this.init();
        this.createObjects();
        this.setupPostprocessing();
        this.setupEventListeners();
        this.animate();

        // Initialize Vanta.js background if enabled
        if (this.options.enableVanta) {
            this.initVanta();
        }
    }

    init() {
        // Get container dimensions
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.options.backgroundColor);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Add orbit controls if enabled
        if (this.options.enableOrbitControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
        }

        // Mouse position for interactive effects
        this.mouse = new THREE.Vector2(0, 0);
        this.targetRotation = new THREE.Vector2(0, 0);
    }

    createObjects() {
        this.objects = [];

        // Create torus
        if (this.options.objectsToRender.includes('torus')) {
            const torusGeometry = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
            const torusMaterial = new THREE.MeshBasicMaterial({ 
                color: this.options.wireframeColor,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            this.torus = new THREE.Mesh(torusGeometry, torusMaterial);
            this.torus.position.set(-2, 1, 0);
            this.scene.add(this.torus);
            this.objects.push(this.torus);
        }

        // Create cube
        if (this.options.objectsToRender.includes('cube')) {
            const cubeGeometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
            const cubeMaterial = new THREE.MeshBasicMaterial({ 
                color: this.options.accentColor,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            this.cube.position.set(2, -1, 0);
            this.scene.add(this.cube);
            this.objects.push(this.cube);
        }

        // Create pyramid
        if (this.options.objectsToRender.includes('pyramid')) {
            const pyramidGeometry = new THREE.ConeGeometry(1, 1.5, 4);
            const pyramidMaterial = new THREE.MeshBasicMaterial({ 
                color: this.options.glowColor,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });
            this.pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
            this.pyramid.rotation.y = Math.PI / 4;
            this.pyramid.position.set(0, -1.5, 1);
            this.scene.add(this.pyramid);
            this.objects.push(this.pyramid);
        }

        // Create particles
        if (this.options.objectsToRender.includes('particles')) {
            const particlesGeometry = new THREE.BufferGeometry();
            const particleCount = 500;
            const posArray = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 10;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.05,
                color: this.options.glowColor,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
            this.scene.add(this.particles);
            this.objects.push(this.particles);
        }
    }

    setupPostprocessing() {
        // Create composer
        this.composer = new EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass for glow effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.width, this.height),
            this.options.bloomStrength,
            this.options.bloomRadius,
            this.options.bloomThreshold
        );
        this.composer.addPass(bloomPass);
    }

    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.width = this.container.clientWidth;
            this.height = this.container.clientHeight;
            
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(this.width, this.height);
            this.composer.setSize(this.width, this.height);
        });

        // Handle mouse movement for interactive effects
        if (this.options.interactive) {
            this.container.addEventListener('mousemove', (event) => {
                // Calculate mouse position in normalized device coordinates
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
                this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;
                
                // Set target rotation based on mouse position
                this.targetRotation.x = this.mouse.y * 0.5;
                this.targetRotation.y = this.mouse.x * 0.5;
            });
        }
    }

    initVanta() {
        // Check if VANTA is available
        if (typeof VANTA === 'undefined') {
            console.warn('VANTA.js is not loaded. Skipping background effect.');
            return;
        }

        // Create a background div for Vanta
        const vantaContainer = document.createElement('div');
        vantaContainer.style.position = 'absolute';
        vantaContainer.style.top = '0';
        vantaContainer.style.left = '0';
        vantaContainer.style.width = '100%';
        vantaContainer.style.height = '100%';
        vantaContainer.style.zIndex = '-1';
        this.container.appendChild(vantaContainer);

        // Initialize Vanta effect based on option
        switch (this.options.vantaEffect.toLowerCase()) {
            case 'globe':
                this.vantaEffect = VANTA.GLOBE({
                    el: vantaContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: this.options.wireframeColor,
                    backgroundColor: this.options.backgroundColor,
                    size: 0.8
                });
                break;
            case 'net':
                this.vantaEffect = VANTA.NET({
                    el: vantaContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: this.options.wireframeColor,
                    backgroundColor: this.options.backgroundColor,
                    points: 10,
                    maxDistance: 20,
                    spacing: 15
                });
                break;
            case 'waves':
                this.vantaEffect = VANTA.WAVES({
                    el: vantaContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: this.options.wireframeColor,
                    shininess: 30,
                    waveHeight: 15,
                    waveSpeed: 0.75,
                    zoom: 0.75
                });
                break;
            case 'dots':
                this.vantaEffect = VANTA.DOTS({
                    el: vantaContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: this.options.wireframeColor,
                    backgroundColor: this.options.backgroundColor,
                    size: 3,
                    spacing: 35
                });
                break;
            default:
                console.warn(`Unknown Vanta effect: ${this.options.vantaEffect}. Using GLOBE.`);
                this.vantaEffect = VANTA.GLOBE({
                    el: vantaContainer,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color: this.options.wireframeColor,
                    backgroundColor: this.options.backgroundColor,
                    size: 0.8
                });
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Rotate objects
        if (this.torus) {
            this.torus.rotation.x += this.options.rotationSpeed;
            this.torus.rotation.y += this.options.rotationSpeed * 0.5;
        }
        
        if (this.cube) {
            this.cube.rotation.x += this.options.rotationSpeed * 0.7;
            this.cube.rotation.y += this.options.rotationSpeed * 0.9;
        }
        
        if (this.pyramid) {
            this.pyramid.rotation.x += this.options.rotationSpeed * 0.8;
            this.pyramid.rotation.z += this.options.rotationSpeed * 0.6;
        }
        
        if (this.particles) {
            this.particles.rotation.y += this.options.rotationSpeed * 0.1;
        }
        
        // Interactive mouse follow effect
        if (this.options.interactive) {
            this.objects.forEach(obj => {
                // Smoothly interpolate towards target rotation
                obj.rotation.x += (this.targetRotation.x - obj.rotation.x) * this.options.mouseFollowIntensity;
                obj.rotation.y += (this.targetRotation.y - obj.rotation.y) * this.options.mouseFollowIntensity;
            });
        }
        
        // Update controls if enabled
        if (this.options.enableOrbitControls && this.controls) {
            this.controls.update();
        }
        
        // Render scene with post-processing
        this.composer.render();
    }

    // Public method to resize the animation
    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
        
        // Resize Vanta effect if it exists
        if (this.vantaEffect && typeof this.vantaEffect.resize === 'function') {
            this.vantaEffect.resize();
        }
    }

    // Public method to destroy the animation and clean up
    destroy() {
        // Remove event listeners
        window.removeEventListener('resize', this.resize);
        
        // Dispose of Three.js objects
        this.objects.forEach(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
            this.scene.remove(obj);
        });
        
        // Destroy Vanta effect if it exists
        if (this.vantaEffect && typeof this.vantaEffect.destroy === 'function') {
            this.vantaEffect.destroy();
        }
        
        // Remove renderer from DOM
        if (this.renderer && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

export default ZedStyleAnimation;
