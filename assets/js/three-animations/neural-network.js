import ThreeJSSetup from './setup.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

class NeuralNetworkAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for neural network
        const defaultOptions = {
            backgroundColor: 0x000000,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 1.5,
            bloomRadius: 0.5,
            bloomThreshold: 0.2,
            cameraZ: 150,
            controlsConfig: {
                autoRotate: true,
                autoRotateSpeed: 0.5,
                enableZoom: true,
                maxDistance: 300,
                minDistance: 50
            }
        };
        
        super(containerId, {...defaultOptions, ...options});
        
        // Neural network parameters
        this.layers = options.layers || [8, 14, 18, 12, 6];
        this.nodeSize = options.nodeSize || 2;
        this.nodeColor = options.nodeColor || 0x00ffff;
        this.activeNodeColor = options.activeNodeColor || 0xff0088;
        this.connectionColor = options.connectionColor || 0x00ffff;
        this.particleSize = options.particleSize || 0.8;
        this.particleCount = options.particleCount || 30;
        this.particleSpeed = options.particleSpeed || 0.3;
        this.activationInterval = options.activationInterval || 2; // seconds
        
        // Initialize the neural network
        this.initializeNetwork();
        
        // Set up the animations
        this.setupAnimations();
        
        // Start the animation loop
        this.animate();
    }
    
    initializeNetwork() {
        // Create groups to hold network elements
        this.nodesGroup = new THREE.Group();
        this.connectionsGroup = new THREE.Group();
        this.particlesGroup = new THREE.Group();
        this.scene.add(this.nodesGroup);
        this.scene.add(this.connectionsGroup);
        this.scene.add(this.particlesGroup);
        
        // Setup nodes and connections data
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.activeConnections = [];
        
        // Calculate network position offsets
        const maxLayerSize = Math.max(...this.layers);
        const layerSpacing = 25;
        const networkWidth = (this.layers.length - 1) * layerSpacing;
        const startX = -networkWidth / 2;
        
        // Create nodes for each layer
        for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
            const layerSize = this.layers[layerIndex];
            const layerHeight = layerSize * 12;
            const startY = -layerHeight / 2;
            
            const layerNodes = [];
            
            // Create nodes for this layer
            for (let nodeIndex = 0; nodeIndex < layerSize; nodeIndex++) {
                const nodeGeometry = new THREE.SphereGeometry(this.nodeSize, 16, 16);
                const nodeMaterial = new THREE.MeshStandardMaterial({
                    color: this.nodeColor,
                    emissive: this.nodeColor,
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.9
                });
                
                const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
                
                // Position the node
                const x = startX + layerIndex * layerSpacing;
                const y = startY + nodeIndex * (layerHeight / (layerSize - 1 || 1));
                const z = 0;
                
                nodeMesh.position.set(x, y, z);
                
                // Add a slight random offset for more organic feel
                nodeMesh.position.x += (Math.random() - 0.5) * 2;
                nodeMesh.position.y += (Math.random() - 0.5) * 2;
                nodeMesh.position.z += (Math.random() - 0.5) * 5;
                
                this.nodesGroup.add(nodeMesh);
                
                // Store node data
                const nodeData = {
                    mesh: nodeMesh,
                    position: nodeMesh.position.clone(),
                    layer: layerIndex,
                    index: nodeIndex,
                    isActive: false,
                    connections: []
                };
                
                layerNodes.push(nodeData);
            }
            
            this.nodes.push(layerNodes);
        }
        
        // Create connections between layers
        for (let layerIndex = 0; layerIndex < this.layers.length - 1; layerIndex++) {
            const currentLayer = this.nodes[layerIndex];
            const nextLayer = this.nodes[layerIndex + 1];
            
            // Connect each node in current layer to some nodes in next layer
            for (let nodeIndex = 0; nodeIndex < currentLayer.length; nodeIndex++) {
                const sourceNode = currentLayer[nodeIndex];
                
                // Determine how many random connections to make (more for smaller networks)
                const connectionsCount = Math.min(
                    nextLayer.length,
                    Math.max(2, Math.floor(nextLayer.length * 0.6))
                );
                
                // Create random connections without duplicates
                const targetIndices = this.getRandomIndices(nextLayer.length, connectionsCount);
                
                for (const targetIndex of targetIndices) {
                    const targetNode = nextLayer[targetIndex];
                    
                    // Create the connection line
                    const connectionMaterial = new THREE.LineBasicMaterial({
                        color: this.connectionColor,
                        transparent: true,
                        opacity: 0.2,
                        linewidth: 1
                    });
                    
                    const points = [
                        sourceNode.position.clone(),
                        targetNode.position.clone()
                    ];
                    
                    const connectionGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const connectionLine = new THREE.Line(connectionGeometry, connectionMaterial);
                    
                    this.connectionsGroup.add(connectionLine);
                    
                    // Store connection data
                    const connectionData = {
                        line: connectionLine,
                        source: sourceNode,
                        target: targetNode,
                        isActive: false,
                        particles: []
                    };
                    
                    this.connections.push(connectionData);
                    
                    // Reference the connection from the nodes
                    sourceNode.connections.push(connectionData);
                    targetNode.connections.push(connectionData);
                }
            }
        }
        
        // Add glow effect for nodes
        const glowMaterial = new THREE.SpriteMaterial({
            map: this.createGlowTexture(),
            color: this.nodeColor,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        // Add glow sprites to nodes
        this.nodes.flat().forEach(node => {
            const sprite = new THREE.Sprite(glowMaterial.clone());
            sprite.scale.set(this.nodeSize * 6, this.nodeSize * 6, 1);
            node.mesh.add(sprite);
            node.glowSprite = sprite;
        });
    }
    
    getRandomIndices(max, count) {
        const indices = [];
        while (indices.length < count) {
            const index = Math.floor(Math.random() * max);
            if (!indices.includes(index)) {
                indices.push(index);
            }
        }
        return indices;
    }
    
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );
        
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    setupAnimations() {
        // Create particle material
        this.particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: this.particleSize,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: this.createGlowTexture(),
            depthWrite: false
        });
        
        // Set up node pulsing animation
        this.nodes.flat().forEach(node => {
            gsap.to(node.mesh.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
        
        // Setup the update function
        this.update = (delta, elapsedTime) => {
            // Randomly activate nodes and connections
            if (elapsedTime % this.activationInterval < delta) {
                this.activateRandomNode();
            }
            
            // Update particles
            this.updateParticles(delta);
            
            // Apply gentle floating movement to all nodes
            this.nodes.flat().forEach(node => {
                node.mesh.position.x += Math.sin(elapsedTime * 0.5 + node.index) * 0.01;
                node.mesh.position.y += Math.cos(elapsedTime * 0.3 + node.index) * 0.01;
                node.mesh.position.z += Math.sin(elapsedTime * 0.7 + node.layer) * 0.01;
            });
        };
    }
    
    activateRandomNode() {
        // Choose a random layer (preference to early layers)
        const layerIndex = Math.floor(Math.pow(Math.random(), 1.5) * this.layers.length);
        const layer = this.nodes[layerIndex];
        
        // Choose a random node in that layer
        const nodeIndex = Math.floor(Math.random() * layer.length);
        const node = layer[nodeIndex];
        
        // Activate the node
        this.activateNode(node);
    }
    
    activateNode(node) {
        if (node.isActive) return;
        
        // Highlight the node
        node.isActive = true;
        gsap.to(node.mesh.material, {
            color: new THREE.Color(this.activeNodeColor),
            emissive: new THREE.Color(this.activeNodeColor),
            emissiveIntensity: 1,
            duration: 0.3
        });
        gsap.to(node.glowSprite.material, {
            color: new THREE.Color(this.activeNodeColor),
            duration: 0.3
        });
        
        // Pulse the node
        gsap.to(node.mesh.scale, {
            x: 1.8,
            y: 1.8,
            z: 1.8,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });
        
        // Find outgoing connections
        const outgoingConnections = this.connections.filter(
            conn => conn.source === node && !conn.isActive
        );
        
        // Activate these connections
        outgoingConnections.forEach(connection => {
            this.activateConnection(connection);
            
            // Activate the target node after a delay
            setTimeout(() => {
                this.activateNode(connection.target);
            }, 300 + Math.random() * 200);
        });
        
        // Deactivate after a while
        setTimeout(() => {
            gsap.to(node.mesh.material, {
                color: new THREE.Color(this.nodeColor),
                emissive: new THREE.Color(this.nodeColor),
                emissiveIntensity: 0.5,
                duration: 0.5
            });
            gsap.to(node.glowSprite.material, {
                color: new THREE.Color(this.nodeColor),
                duration: 0.5
            });
            node.isActive = false;
        }, 1000 + Math.random() * 1000);
    }
    
    activateConnection(connection) {
        if (connection.isActive) return;
        
        // Highlight the connection
        connection.isActive = true;
        gsap.to(connection.line.material, {
            opacity: 0.8,
            duration: 0.3
        });
        
        // Create particles along the connection
        this.createParticlesForConnection(connection);
        
        // Deactivate after a while
        setTimeout(() => {
            gsap.to(connection.line.material, {
                opacity: 0.2,
                duration: 0.5
            });
            connection.isActive = false;
        }, 1000 + Math.random() * 500);
    }
    
    createParticlesForConnection(connection) {
        const particleCount = this.particleCount;
        const positions = new Float32Array(particleCount * 3);
        const particleGeometry = new THREE.BufferGeometry();
        
        const sourcePos = connection.source.position;
        const targetPos = connection.target.position;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            // Random position along the connection line
            const t = Math.random();
            const x = sourcePos.x + (targetPos.x - sourcePos.x) * t;
            const y = sourcePos.y + (targetPos.y - sourcePos.y) * t;
            const z = sourcePos.z + (targetPos.z - sourcePos.z) * t;
            
            // Add some random offset for more organic feel
            const offset = 0.5;
            positions[i * 3] = x + (Math.random() - 0.5) * offset;
            positions[i * 3 + 1] = y + (Math.random() - 0.5) * offset;
            positions[i * 3 + 2] = z + (Math.random() - 0.5) * offset;
            
            particles.push({
                connection,
                progress: t,
                speed: this.particleSpeed * (0.5 + Math.random() * 0.5),
                offset: new THREE.Vector3(
                    (Math.random() - 0.5) * offset,
                    (Math.random() - 0.5) * offset,
                    (Math.random() - 0.5) * offset
                )
            });
        }
        
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const particleSystem = new THREE.Points(particleGeometry, this.particleMaterial);
        
        this.particlesGroup.add(particleSystem);
        this.particles.push(...particles);
        
        // Store reference to particles and system
        connection.particleSystem = particleSystem;
        connection.particles = particles;
    }
    
    updateParticles(delta) {
        // Process each active connection's particles
        this.connections.filter(conn => conn.isActive).forEach(connection => {
            if (!connection.particleSystem) return;
            
            const positions = connection.particleSystem.geometry.attributes.position.array;
            const sourcePos = connection.source.position;
            const targetPos = connection.target.position;
            
            // Update each particle
            connection.particles.forEach((particle, index) => {
                // Move particle along connection
                particle.progress += particle.speed * delta;
                
                // If particle reaches the end, reset to beginning
                if (particle.progress > 1) {
                    particle.progress = 0;
                }
                
                // Calculate new position
                const t = particle.progress;
                const x = sourcePos.x + (targetPos.x - sourcePos.x) * t;
                const y = sourcePos.y + (targetPos.y - sourcePos.y) * t;
                const z = sourcePos.z + (targetPos.z - sourcePos.z) * t;
                
                // Update the position in the geometry
                positions[index * 3] = x + particle.offset.x;
                positions[index * 3 + 1] = y + particle.offset.y;
                positions[index * 3 + 2] = z + particle.offset.z;
            });
            
            // Tell Three.js to update the particles
            connection.particleSystem.geometry.attributes.position.needsUpdate = true;
        });
        
        // Remove inactive connections' particles
        this.connections.filter(conn => !conn.isActive && conn.particleSystem).forEach(connection => {
            // Remove the particles from the global list
            this.particles = this.particles.filter(p => p.connection !== connection);
            
            // Remove the particle system from the scene
            this.particlesGroup.remove(connection.particleSystem);
            connection.particleSystem.geometry.dispose();
            connection.particleSystem = null;
            connection.particles = [];
        });
    }
}

export default NeuralNetworkAnimation; 