import ThreeJSSetup from './setup.js';
import * as THREE from 'three';

class AIVoiceWaveformAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for AI voice waveform animation
        const defaultOptions = {
            backgroundColor: 0x000000,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 1.0,
            bloomRadius: 0.5,
            bloomThreshold: 0.2,
            cameraZ: 100,
            controlsConfig: {
                autoRotate: true,
                autoRotateSpeed: 0.3,
                enableZoom: true,
                maxDistance: 200,
                minDistance: 50
            }
        };
        
        super(containerId, {...defaultOptions, ...options});
        
        // Waveform parameters
        this.waveformWidth = options.waveformWidth || 80;
        this.waveformHeight = options.waveformHeight || 40;
        this.waveformDepth = options.waveformDepth || 40;
        this.barCount = options.barCount || 64;
        this.barWidth = options.barWidth || 0.6;
        this.barMaxHeight = options.barMaxHeight || 20;
        this.waveformColor = options.waveformColor || 0x4d9fff;
        this.pulseColor = options.pulseColor || 0xff4d9f;
        this.waveSpeed = options.waveSpeed || 1.0;
        
        // Voice activity simulation
        this.speaking = false;
        this.speakingTime = 0;
        this.pauseTime = 0;
        this.currentPauseTime = 0;
        this.currentSpeakingTime = 0;
        
        // Initialize the waveform
        this.initializeWaveform();
        
        // Start the animation loop
        this.animate();
    }
    
    initializeWaveform() {
        // Create groups
        this.waveformGroup = new THREE.Group();
        this.scene.add(this.waveformGroup);
        
        // Create circular waveform
        this.createCircularWaveform();
        
        // Create center sphere
        this.createCenterSphere();
        
        // Create pulse rings
        this.createPulseRings();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
        
        // Add point light in the center
        const pointLight = new THREE.PointLight(this.waveformColor, 1, 200);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
        
        // Setup the update function
        this.update = (delta, elapsedTime) => {
            // Update voice activity
            this.updateVoiceActivity(delta, elapsedTime);
            
            // Update waveform
            this.updateWaveform(delta, elapsedTime);
            
            // Update pulse rings
            this.updatePulseRings(delta, elapsedTime);
            
            // Rotate the entire waveform
            this.waveformGroup.rotation.y += 0.002;
        };
    }
    
    createCircularWaveform() {
        // Create bars in a circular pattern
        this.bars = [];
        
        for (let i = 0; i < this.barCount; i++) {
            // Calculate angle
            const angle = (i / this.barCount) * Math.PI * 2;
            
            // Calculate position
            const x = Math.cos(angle) * this.waveformWidth / 2;
            const z = Math.sin(angle) * this.waveformWidth / 2;
            
            // Create bar geometry
            const geometry = new THREE.BoxGeometry(this.barWidth, 1, this.barWidth);
            
            // Create material
            const material = new THREE.MeshPhongMaterial({
                color: this.waveformColor,
                transparent: true,
                opacity: 0.8,
                emissive: this.waveformColor,
                emissiveIntensity: 0.3
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, 0, z);
            mesh.lookAt(0, 0, 0); // Orient towards center
            
            // Adjust rotation to make bars point outward
            mesh.rotation.x = Math.PI / 2;
            
            this.waveformGroup.add(mesh);
            
            // Store bar data
            this.bars.push({
                mesh: mesh,
                angle: angle,
                radius: this.waveformWidth / 2,
                height: 1,
                phase: i / this.barCount * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5
            });
        }
        
        // Create inner circular waveform
        for (let i = 0; i < this.barCount; i++) {
            // Calculate angle
            const angle = (i / this.barCount) * Math.PI * 2;
            
            // Calculate position
            const x = Math.cos(angle) * this.waveformWidth / 4;
            const z = Math.sin(angle) * this.waveformWidth / 4;
            
            // Create bar geometry
            const geometry = new THREE.BoxGeometry(this.barWidth, 1, this.barWidth);
            
            // Create material
            const material = new THREE.MeshPhongMaterial({
                color: this.waveformColor,
                transparent: true,
                opacity: 0.8,
                emissive: this.waveformColor,
                emissiveIntensity: 0.3
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, 0, z);
            mesh.lookAt(0, 0, 0); // Orient towards center
            
            // Adjust rotation to make bars point outward
            mesh.rotation.x = Math.PI / 2;
            
            this.waveformGroup.add(mesh);
            
            // Store bar data
            this.bars.push({
                mesh: mesh,
                angle: angle,
                radius: this.waveformWidth / 4,
                height: 1,
                phase: i / this.barCount * Math.PI * 2 + Math.PI,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    createCenterSphere() {
        // Create center sphere
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: this.waveformColor,
            transparent: true,
            opacity: 0.9,
            emissive: this.waveformColor,
            emissiveIntensity: 0.5
        });
        
        this.centerSphere = new THREE.Mesh(geometry, material);
        this.waveformGroup.add(this.centerSphere);
    }
    
    createPulseRings() {
        // Create pulse rings
        this.pulseRings = [];
        
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.RingGeometry(1, 2, 32);
            const material = new THREE.MeshBasicMaterial({
                color: this.pulseColor,
                transparent: true,
                opacity: 0,
                side: THREE.DoubleSide
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = Math.PI / 2;
            this.waveformGroup.add(mesh);
            
            this.pulseRings.push({
                mesh: mesh,
                active: false,
                scale: 1,
                opacity: 0
            });
        }
    }
    
    updateVoiceActivity(delta, elapsedTime) {
        // Simulate voice activity
        if (this.speaking) {
            this.currentSpeakingTime += delta;
            
            if (this.currentSpeakingTime >= this.speakingTime) {
                this.speaking = false;
                this.currentSpeakingTime = 0;
                this.currentPauseTime = 0;
                this.pauseTime = 1 + Math.random() * 2; // Random pause time
            }
        } else {
            this.currentPauseTime += delta;
            
            if (this.currentPauseTime >= this.pauseTime) {
                this.speaking = true;
                this.currentPauseTime = 0;
                this.currentSpeakingTime = 0;
                this.speakingTime = 2 + Math.random() * 3; // Random speaking time
                
                // Trigger pulse ring
                this.triggerPulseRing();
            }
        }
        
        // Update center sphere
        if (this.speaking) {
            // Pulse the center sphere
            const pulseScale = 1 + 0.2 * Math.sin(elapsedTime * 10);
            this.centerSphere.scale.set(pulseScale, pulseScale, pulseScale);
            
            // Change color to indicate speaking
            this.centerSphere.material.color.lerp(new THREE.Color(this.pulseColor), delta * 5);
            this.centerSphere.material.emissive.lerp(new THREE.Color(this.pulseColor), delta * 5);
        } else {
            // Return to normal
            this.centerSphere.scale.set(1, 1, 1);
            
            // Change color back
            this.centerSphere.material.color.lerp(new THREE.Color(this.waveformColor), delta * 2);
            this.centerSphere.material.emissive.lerp(new THREE.Color(this.waveformColor), delta * 2);
        }
    }
    
    updateWaveform(delta, elapsedTime) {
        // Update waveform bars
        for (let i = 0; i < this.bars.length; i++) {
            const bar = this.bars[i];
            
            // Calculate height based on sine wave and voice activity
            let height;
            
            if (this.speaking) {
                // More active waveform when speaking
                height = 2 + Math.sin(elapsedTime * this.waveSpeed * bar.speed + bar.phase) * 
                         Math.sin(elapsedTime * 5) * this.barMaxHeight;
            } else {
                // Less active waveform when not speaking
                height = 2 + Math.sin(elapsedTime * bar.speed + bar.phase) * 3;
            }
            
            // Ensure minimum height
            height = Math.max(1, height);
            
            // Update bar height
            bar.mesh.scale.y = height;
            
            // Update bar position to maintain bottom position
            bar.mesh.position.y = height / 2;
            
            // Update bar color
            if (this.speaking) {
                // Gradually change color when speaking
                const colorFactor = 0.5 + 0.5 * Math.sin(elapsedTime * 10 + bar.phase);
                bar.mesh.material.color.lerp(new THREE.Color(this.pulseColor), colorFactor * delta * 3);
                bar.mesh.material.emissive.lerp(new THREE.Color(this.pulseColor), colorFactor * delta * 3);
            } else {
                // Return to normal color
                bar.mesh.material.color.lerp(new THREE.Color(this.waveformColor), delta * 2);
                bar.mesh.material.emissive.lerp(new THREE.Color(this.waveformColor), delta * 2);
            }
        }
    }
    
    updatePulseRings(delta, elapsedTime) {
        // Update pulse rings
        for (let i = 0; i < this.pulseRings.length; i++) {
            const ring = this.pulseRings[i];
            
            if (ring.active) {
                // Expand ring
                ring.scale += delta * 30;
                ring.opacity -= delta * 0.5;
                
                // Update mesh
                ring.mesh.scale.set(ring.scale, ring.scale, ring.scale);
                ring.mesh.material.opacity = Math.max(0, ring.opacity);
                
                // Deactivate when fully expanded
                if (ring.opacity <= 0) {
                    ring.active = false;
                }
            }
        }
    }
    
    triggerPulseRing() {
        // Find an inactive ring
        for (let i = 0; i < this.pulseRings.length; i++) {
            const ring = this.pulseRings[i];
            
            if (!ring.active) {
                // Activate ring
                ring.active = true;
                ring.scale = 5;
                ring.opacity = 0.7;
                
                // Update mesh
                ring.mesh.scale.set(ring.scale, ring.scale, ring.scale);
                ring.mesh.material.opacity = ring.opacity;
                
                break;
            }
        }
    }
}

export default AIVoiceWaveformAnimation;
