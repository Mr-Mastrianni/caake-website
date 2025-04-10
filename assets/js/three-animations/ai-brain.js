import ThreeJSSetup from './setup.js';

class AIBrainAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for AI brain animation
        const defaultOptions = {
            backgroundColor: 0x000000,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 1.2,
            bloomRadius: 0.5,
            bloomThreshold: 0.2,
            cameraZ: 150,
            controlsConfig: {
                autoRotate: true,
                autoRotateSpeed: 0.3,
                enableZoom: true,
                maxDistance: 300,
                minDistance: 50
            }
        };
        
        super(containerId, {...defaultOptions, ...options});
        
        // Brain parameters
        this.particleCount = options.particleCount || 3000;
        this.brainSize = options.brainSize || 50;
        this.particleSize = options.particleSize || 0.5;
        this.connectionDistance = options.connectionDistance || 10;
        this.connectionCount = options.connectionCount || 3;
        this.pulseSpeed = options.pulseSpeed || 0.5;
        this.particleColors = options.particleColors || [
            new THREE.Color(0x4d9fff), // Blue
            new THREE.Color(0x9d6eff), // Purple
            new THREE.Color(0xff4d9f)  // Pink
        ];
        
        // Initialize the brain
        this.initializeBrain();
        
        // Start the animation loop
        this.animate();
    }
    
    initializeBrain() {
        // Create groups to hold brain elements
        this.particlesGroup = new THREE.Group();
        this.connectionsGroup = new THREE.Group();
        this.scene.add(this.particlesGroup);
        this.scene.add(this.connectionsGroup);
        
        // Create particles
        this.particles = [];
        this.createBrainParticles();
        
        // Create connections
        this.connections = [];
        this.createConnections();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
        
        // Add point light in the center
        const pointLight = new THREE.PointLight(0x9d6eff, 1, 100);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
        
        // Setup the update function
        this.update = (delta, elapsedTime) => {
            // Pulse the brain
            this.pulseBrain(elapsedTime);
            
            // Update connections
            this.updateConnections(elapsedTime);
            
            // Rotate the entire brain slightly
            this.particlesGroup.rotation.y += 0.001;
            this.connectionsGroup.rotation.y += 0.001;
        };
    }
    
    createBrainParticles() {
        // Create a geometry for all particles
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        
        // Create particles in a brain-like shape (ellipsoid)
        for (let i = 0; i < this.particleCount; i++) {
            // Create a point in a spherical coordinate system
            const theta = Math.random() * Math.PI * 2; // Azimuthal angle
            const phi = Math.acos(2 * Math.random() - 1); // Polar angle
            
            // Convert to Cartesian coordinates with ellipsoid shape
            const x = this.brainSize * 1.2 * Math.sin(phi) * Math.cos(theta);
            const y = this.brainSize * 0.8 * Math.sin(phi) * Math.sin(theta);
            const z = this.brainSize * 1.0 * Math.cos(phi);
            
            // Add some randomness to make it more organic
            const jitter = this.brainSize * 0.15;
            positions[i * 3] = x + (Math.random() - 0.5) * jitter;
            positions[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
            positions[i * 3 + 2] = z + (Math.random() - 0.5) * jitter;
            
            // Store particle data for later use
            this.particles.push({
                index: i,
                position: new THREE.Vector3(
                    positions[i * 3],
                    positions[i * 3 + 1],
                    positions[i * 3 + 2]
                ),
                originalPosition: new THREE.Vector3(
                    positions[i * 3],
                    positions[i * 3 + 1],
                    positions[i * 3 + 2]
                ),
                size: this.particleSize * (0.5 + Math.random() * 0.5),
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5,
                connections: []
            });
            
            // Random color from our palette
            const color = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // Random size
            sizes[i] = this.particles[i].size;
        }
        
        // Set attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: this.createParticleTexture() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                    if (gl_FragColor.a < 0.3) discard;
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            vertexColors: true
        });
        
        // Create the particle system
        this.particleSystem = new THREE.Points(geometry, material);
        this.particlesGroup.add(this.particleSystem);
    }
    
    createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    createConnections() {
        // Create connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Find nearest particles
            const nearParticles = this.findNearestParticles(particle, this.connectionCount);
            
            // Create connections
            for (let j = 0; j < nearParticles.length; j++) {
                const targetParticle = nearParticles[j];
                
                // Skip if connection already exists
                if (particle.connections.includes(targetParticle.index) || 
                    targetParticle.connections.includes(particle.index)) {
                    continue;
                }
                
                // Create line geometry
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(6); // Two points, each with x, y, z
                
                // Set initial positions
                positions[0] = particle.position.x;
                positions[1] = particle.position.y;
                positions[2] = particle.position.z;
                positions[3] = targetParticle.position.x;
                positions[4] = targetParticle.position.y;
                positions[5] = targetParticle.position.z;
                
                geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                
                // Create line material
                const material = new THREE.LineBasicMaterial({
                    color: this.particleColors[Math.floor(Math.random() * this.particleColors.length)],
                    transparent: true,
                    opacity: 0.2 + Math.random() * 0.3
                });
                
                // Create line
                const line = new THREE.Line(geometry, material);
                this.connectionsGroup.add(line);
                
                // Store connection data
                this.connections.push({
                    line: line,
                    source: particle.index,
                    target: targetParticle.index,
                    active: false,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.5 + Math.random() * 1.5
                });
                
                // Update particle connections
                particle.connections.push(targetParticle.index);
                targetParticle.connections.push(particle.index);
            }
        }
    }
    
    findNearestParticles(particle, count) {
        // Calculate distances to all other particles
        const distances = [];
        
        for (let i = 0; i < this.particles.length; i++) {
            if (i === particle.index) continue;
            
            const otherParticle = this.particles[i];
            const distance = particle.position.distanceTo(otherParticle.position);
            
            if (distance < this.connectionDistance) {
                distances.push({
                    index: i,
                    particle: otherParticle,
                    distance: distance
                });
            }
        }
        
        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);
        
        // Return the nearest particles
        return distances.slice(0, count).map(d => d.particle);
    }
    
    pulseBrain(elapsedTime) {
        // Update particle positions to create a pulsing effect
        const positions = this.particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            // Calculate pulse factor
            const pulseFactor = Math.sin(elapsedTime * particle.speed + particle.phase) * 0.05;
            
            // Update position with pulse
            const newPos = particle.originalPosition.clone().multiplyScalar(1 + pulseFactor);
            
            // Update buffer geometry
            positions[i * 3] = newPos.x;
            positions[i * 3 + 1] = newPos.y;
            positions[i * 3 + 2] = newPos.z;
            
            // Update particle position for connection updates
            particle.position.copy(newPos);
        }
        
        // Mark position attribute as needing update
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    updateConnections(elapsedTime) {
        // Update connection positions and pulse effect
        for (let i = 0; i < this.connections.length; i++) {
            const connection = this.connections[i];
            const sourceParticle = this.particles[connection.source];
            const targetParticle = this.particles[connection.target];
            
            // Update line positions
            const positions = connection.line.geometry.attributes.position.array;
            positions[0] = sourceParticle.position.x;
            positions[1] = sourceParticle.position.y;
            positions[2] = sourceParticle.position.z;
            positions[3] = targetParticle.position.x;
            positions[4] = targetParticle.position.y;
            positions[5] = targetParticle.position.z;
            
            // Mark as needing update
            connection.line.geometry.attributes.position.needsUpdate = true;
            
            // Pulse opacity
            const pulseFactor = 0.5 + 0.5 * Math.sin(elapsedTime * connection.pulseSpeed + connection.pulsePhase);
            connection.line.material.opacity = 0.1 + pulseFactor * 0.3;
            
            // Randomly activate connections
            if (Math.random() < 0.001) {
                this.activateConnection(i);
            }
        }
    }
    
    activateConnection(index) {
        const connection = this.connections[index];
        
        // Skip if already active
        if (connection.active) return;
        
        connection.active = true;
        
        // Increase opacity
        const originalOpacity = connection.line.material.opacity;
        connection.line.material.opacity = 0.8;
        
        // Change color to bright
        const originalColor = connection.line.material.color.clone();
        connection.line.material.color.set(0xffffff);
        
        // Reset after a short delay
        setTimeout(() => {
            connection.active = false;
            connection.line.material.opacity = originalOpacity;
            connection.line.material.color.copy(originalColor);
        }, 200 + Math.random() * 300);
    }
}

export default AIBrainAnimation;
