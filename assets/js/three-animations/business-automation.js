import ThreeJSSetup from './setup.js';

class BusinessAutomationAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for business automation visualization
        const defaultOptions = {
            backgroundColor: 0x05071F,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 0.7,
            bloomRadius: 0.4,
            bloomThreshold: 0.3,
            cameraZ: 30,
            cameraY: 5,
            cameraX: 0,
            controlsConfig: {
                enableZoom: false,
                enablePan: false,
                autoRotate: true,
                autoRotateSpeed: 0.3,
                maxDistance: 100,
                minDistance: 10
            }
        };
        
        // Merge default options with provided options
        const mergedOptions = { ...defaultOptions, ...options };
        super(containerId, mergedOptions);
        
        // Workflow parameters
        this.workflowParams = {
            nodes: 5,
            nodeSize: 1.2,
            nodeSpacing: 6,
            nodeHeight: 0,
            colors: {
                nodes: [0x3498db, 0xe74c3c, 0xf1c40f, 0x2ecc71, 0x9b59b6],
                connections: 0x66ccff,
                particles: 0xffffff
            }
        };
        
        // Data flow parameters
        this.dataFlowParams = {
            particleCount: 50,
            particleSize: 0.2,
            particleSpeed: 0.8,
            pathWidth: 0.5
        };
        
        // Initialize the visualization
        this.init();
    }
    
    init() {
        // Create workflow nodes
        this.createWorkflowNodes();
        
        // Create data flow paths
        this.createDataFlowPaths();
        
        // Create data particles
        this.createDataParticles();
        
        // Setup animations
        this.setupAnimations();
        
        // Start animation loop
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }
    
    createWorkflowNodes() {
        // Create workflow group
        this.workflowGroup = new THREE.Group();
        this.scene.add(this.workflowGroup);
        
        // Create nodes
        this.nodes = [];
        
        // Node geometries
        const nodeGeometries = [
            new THREE.BoxGeometry(this.workflowParams.nodeSize, this.workflowParams.nodeSize, this.workflowParams.nodeSize),
            new THREE.SphereGeometry(this.workflowParams.nodeSize / 2, 32, 32),
            new THREE.CylinderGeometry(this.workflowParams.nodeSize / 2, this.workflowParams.nodeSize / 2, this.workflowParams.nodeSize, 32),
            new THREE.OctahedronGeometry(this.workflowParams.nodeSize / 2, 0),
            new THREE.TorusGeometry(this.workflowParams.nodeSize / 2, this.workflowParams.nodeSize / 6, 16, 32)
        ];
        
        // Create nodes in a circular arrangement
        for (let i = 0; i < this.workflowParams.nodes; i++) {
            const angle = (i / this.workflowParams.nodes) * Math.PI * 2;
            const x = Math.cos(angle) * this.workflowParams.nodeSpacing;
            const z = Math.sin(angle) * this.workflowParams.nodeSpacing;
            const y = this.workflowParams.nodeHeight;
            
            // Create node material
            const nodeMaterial = new THREE.MeshPhongMaterial({
                color: this.workflowParams.colors.nodes[i % this.workflowParams.colors.nodes.length],
                emissive: this.workflowParams.colors.nodes[i % this.workflowParams.colors.nodes.length],
                emissiveIntensity: 0.3,
                shininess: 100
            });
            
            // Create node mesh
            const nodeGeometry = nodeGeometries[i % nodeGeometries.length];
            const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            nodeMesh.position.set(x, y, z);
            
            // Add glow effect
            const glowMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(this.workflowParams.colors.nodes[i % this.workflowParams.colors.nodes.length]) }
                },
                vertexShader: `
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    
                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                        gl_FragColor = vec4(color, intensity * 0.5);
                    }
                `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            
            const glowMesh = new THREE.Mesh(nodeGeometry.clone(), glowMaterial);
            glowMesh.scale.multiplyScalar(1.2);
            glowMesh.position.copy(nodeMesh.position);
            
            // Add to scene
            this.workflowGroup.add(nodeMesh);
            this.workflowGroup.add(glowMesh);
            
            // Store node data
            this.nodes.push({
                mesh: nodeMesh,
                glow: glowMesh,
                position: new THREE.Vector3(x, y, z),
                index: i,
                isActive: false
            });
        }
    }
    
    createDataFlowPaths() {
        // Create paths group
        this.pathsGroup = new THREE.Group();
        this.workflowGroup.add(this.pathsGroup);
        
        // Create paths between nodes
        this.paths = [];
        
        // Path material
        const pathMaterial = new THREE.MeshPhongMaterial({
            color: this.workflowParams.colors.connections,
            emissive: this.workflowParams.colors.connections,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        // Connect each node to the next node in sequence
        for (let i = 0; i < this.nodes.length; i++) {
            const currentNode = this.nodes[i];
            const nextNode = this.nodes[(i + 1) % this.nodes.length];
            
            // Create path
            const path = this.createPath(currentNode.position, nextNode.position, pathMaterial);
            this.pathsGroup.add(path.mesh);
            
            // Store path data
            this.paths.push({
                start: currentNode,
                end: nextNode,
                mesh: path.mesh,
                curve: path.curve,
                length: path.length,
                particles: []
            });
        }
        
        // Add some cross-connections for complexity
        if (this.nodes.length >= 4) {
            // Connect node 0 to node 2
            const path1 = this.createPath(this.nodes[0].position, this.nodes[2].position, pathMaterial);
            this.pathsGroup.add(path1.mesh);
            
            this.paths.push({
                start: this.nodes[0],
                end: this.nodes[2],
                mesh: path1.mesh,
                curve: path1.curve,
                length: path1.length,
                particles: []
            });
            
            // Connect node 1 to node 3
            const path2 = this.createPath(this.nodes[1].position, this.nodes[3].position, pathMaterial);
            this.pathsGroup.add(path2.mesh);
            
            this.paths.push({
                start: this.nodes[1],
                end: this.nodes[3],
                mesh: path2.mesh,
                curve: path2.curve,
                length: path2.length,
                particles: []
            });
        }
    }
    
    createPath(startPoint, endPoint, material) {
        // Create a curved path between two points
        const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
        
        // Add some height to the midpoint for a nice curve
        midPoint.y += 2 + Math.random() * 2;
        
        // Create a quadratic bezier curve
        const curve = new THREE.QuadraticBezierCurve3(
            startPoint,
            midPoint,
            endPoint
        );
        
        // Create geometry from curve
        const points = curve.getPoints(50);
        const geometry = new THREE.TubeGeometry(curve, 50, this.dataFlowParams.pathWidth / 2, 8, false);
        
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Calculate curve length
        let length = 0;
        for (let i = 1; i < points.length; i++) {
            length += points[i].distanceTo(points[i - 1]);
        }
        
        return { mesh, curve, length };
    }
    
    createDataParticles() {
        // Create particles group
        this.particlesGroup = new THREE.Group();
        this.workflowGroup.add(this.particlesGroup);
        
        // Create particle material
        this.particleMaterial = new THREE.PointsMaterial({
            color: this.workflowParams.colors.particles,
            size: this.dataFlowParams.particleSize,
            transparent: true,
            blending: THREE.AdditiveBlending,
            map: this.createGlowTexture(),
            depthWrite: false
        });
        
        // Initialize particles on each path
        this.paths.forEach(path => {
            const particleCount = Math.floor(path.length * 2);
            
            for (let i = 0; i < particleCount; i++) {
                // Random position along the path
                const progress = Math.random();
                const position = path.curve.getPointAt(progress);
                
                // Create particle geometry
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([position.x, position.y, position.z], 3));
                
                // Create particle system
                const particle = new THREE.Points(geometry, this.particleMaterial);
                this.particlesGroup.add(particle);
                
                // Store particle data
                path.particles.push({
                    mesh: particle,
                    progress,
                    speed: 0.2 + Math.random() * 0.3 // Random speed
                });
            }
        });
    }
    
    createGlowTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        
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
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
    
    setupAnimations() {
        // Setup node animations
        this.nodes.forEach(node => {
            // Add floating animation
            gsap.to(node.mesh.position, {
                y: node.position.y + 0.5,
                duration: 2 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Add rotation animation
            gsap.to(node.mesh.rotation, {
                x: Math.PI * 2,
                y: Math.PI * 2,
                z: Math.PI * 2,
                duration: 10 + Math.random() * 5,
                repeat: -1,
                ease: "none"
            });
        });
        
        // Setup the update function
        this.update = (delta, elapsedTime) => {
            // Update workflow group rotation
            this.workflowGroup.rotation.y += delta * 0.1;
            
            // Update particles
            this.updateParticles(delta);
            
            // Activate random nodes
            if (Math.random() < 0.01) {
                this.activateRandomNode();
            }
        };
    }
    
    updateParticles(delta) {
        // Update particles on each path
        this.paths.forEach(path => {
            path.particles.forEach(particle => {
                // Update progress
                particle.progress += delta * particle.speed * this.dataFlowParams.particleSpeed;
                
                // Reset if reached the end
                if (particle.progress > 1) {
                    particle.progress = 0;
                }
                
                // Update position
                const position = path.curve.getPointAt(particle.progress);
                
                // Update particle position
                const positionAttribute = particle.mesh.geometry.getAttribute('position');
                positionAttribute.setXYZ(0, position.x, position.y, position.z);
                positionAttribute.needsUpdate = true;
            });
        });
    }
    
    activateRandomNode() {
        // Select a random node
        const randomIndex = Math.floor(Math.random() * this.nodes.length);
        const node = this.nodes[randomIndex];
        
        // Skip if already active
        if (node.isActive) return;
        
        // Activate node
        node.isActive = true;
        
        // Pulse animation
        gsap.to(node.mesh.material, {
            emissiveIntensity: 0.8,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                node.mesh.material.emissiveIntensity = 0.3;
                node.isActive = false;
            }
        });
        
        // Pulse glow
        gsap.to(node.glow.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        });
        
        // Find paths starting from this node
        const outgoingPaths = this.paths.filter(path => path.start === node);
        
        // Activate particles on these paths
        outgoingPaths.forEach(path => {
            // Increase particle speed temporarily
            path.particles.forEach(particle => {
                gsap.to(particle, {
                    speed: particle.speed * 3,
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            });
            
            // Pulse path
            gsap.to(path.mesh.material, {
                emissiveIntensity: 0.8,
                opacity: 1,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    path.mesh.material.emissiveIntensity = 0.3;
                    path.mesh.material.opacity = 0.7;
                }
            });
        });
    }
}

export default BusinessAutomationAnimation;
