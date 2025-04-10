// import * as THREE from 'three'; // Remove this line
import ThreeJSSetup from './setup.js';

class DataFlowNetworkAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for data flow network animation
        const defaultOptions = {
            backgroundColor: 0x050A1F,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 1.0,
            bloomRadius: 0.4,
            bloomThreshold: 0.2,
            cameraZ: 120,
            cameraY: 0,
            controlsConfig: {
                autoRotate: true,
                autoRotateSpeed: 0.3,
                enableZoom: false,
                maxDistance: 200,
                minDistance: 50
            }
        };
        
        // Merge default options with provided options
        const mergedOptions = { ...defaultOptions, ...options };
        super(containerId, mergedOptions);
        
        // Network parameters
        this.networkParams = {
            nodeCount: 32,
            connectionDistance: 40,
            maxConnections: 5,
            nodeSize: { min: 0.5, max: 2.0 },
            nodeColors: [
                new THREE.Color(0x4d9fff), // Blue
                new THREE.Color(0x9d6eff), // Purple
                new THREE.Color(0x2ecc71)  // Green
            ],
            dataPacketColors: [
                new THREE.Color(0xff4d9f), // Pink
                new THREE.Color(0xffdd00), // Yellow
                new THREE.Color(0x00ffdd)  // Cyan
            ],
            nodeDistribution: 60, // Max distance from center
            dataPackets: 30,       // Number of data packets
            dataSpeed: { min: 0.5, max: 2.0 },
            pulseFrequency: 0.5
        };
        
        // Initialize the data flow network
        this.init();
        
        // Start animation loop
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }
    
    init() {
        // Create groups to organize scene elements
        this.nodesGroup = new THREE.Group();
        this.connectionsGroup = new THREE.Group();
        this.dataPacketsGroup = new THREE.Group();
        this.scene.add(this.nodesGroup);
        this.scene.add(this.connectionsGroup);
        this.scene.add(this.dataPacketsGroup);
        
        // Create nodes
        this.nodes = [];
        this.createNodes();
        
        // Create connections between nodes
        this.connections = [];
        this.createConnections();
        
        // Create data packets that travel along connections
        this.dataPackets = [];
        this.createDataPackets();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
        
        // Add point light
        const pointLight = new THREE.PointLight(0x9d6eff, 1, 200);
        pointLight.position.set(0, 20, 0);
        this.scene.add(pointLight);
        
        // Set up the animation update function
        this.update = (delta, elapsedTime) => {
            this.updateNodes(delta, elapsedTime);
            this.updateConnections(delta, elapsedTime);
            this.updateDataPackets(delta, elapsedTime);
        };
    }
    
    createNodes() {
        // Create node geometry (sphere)
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        
        // Create nodes
        for (let i = 0; i < this.networkParams.nodeCount; i++) {
            // Random position within sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = this.networkParams.nodeDistribution * Math.pow(Math.random(), 1/3);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            // Random node size
            const size = this.networkParams.nodeSize.min + 
                Math.random() * (this.networkParams.nodeSize.max - this.networkParams.nodeSize.min);
            
            // Random node color
            const colorIndex = Math.floor(Math.random() * this.networkParams.nodeColors.length);
            const color = this.networkParams.nodeColors[colorIndex];
            
            // Create material with glow effect
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.5,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            mesh.scale.set(size, size, size);
            this.nodesGroup.add(mesh);
            
            // Store node data
            this.nodes.push({
                mesh: mesh,
                position: mesh.position.clone(),
                size: size,
                color: color,
                pulsePhase: Math.random() * Math.PI * 2,
                connections: []
            });
        }
    }
    
    createConnections() {
        // For each node, find closest nodes to connect to
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const potentialConnections = [];
            
            // Calculate distances to all other nodes
            for (let j = 0; j < this.nodes.length; j++) {
                if (i !== j) {
                    const otherNode = this.nodes[j];
                    const distance = node.position.distanceTo(otherNode.position);
                    
                    if (distance < this.networkParams.connectionDistance) {
                        potentialConnections.push({
                            index: j,
                            distance: distance
                        });
                    }
                }
            }
            
            // Sort by distance (closest first)
            potentialConnections.sort((a, b) => a.distance - b.distance);
            
            // Take up to maxConnections
            const connectionsCount = Math.min(
                potentialConnections.length, 
                this.networkParams.maxConnections
            );
            
            for (let k = 0; k < connectionsCount; k++) {
                const connectionIndex = potentialConnections[k].index;
                
                // Skip if already connected (avoiding duplicates)
                if (node.connections.includes(connectionIndex) || 
                    this.nodes[connectionIndex].connections.includes(i)) {
                    continue;
                }
                
                // Add to connections list
                node.connections.push(connectionIndex);
                
                // Create connection line
                const targetNode = this.nodes[connectionIndex];
                const lineGeometry = new THREE.BufferGeometry();
                const lineMaterial = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.2
                });
                
                // Set line vertices
                const points = [
                    node.position.clone(),
                    targetNode.position.clone()
                ];
                lineGeometry.setFromPoints(points);
                
                // Create line
                const line = new THREE.Line(lineGeometry, lineMaterial);
                this.connectionsGroup.add(line);
                
                // Store connection data
                this.connections.push({
                    line: line,
                    sourceIndex: i,
                    targetIndex: connectionIndex,
                    active: false,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.5 + Math.random()
                });
            }
        }
    }
    
    createDataPackets() {
        // Create data packet geometry (small sphere)
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        
        // Create data packets
        for (let i = 0; i < this.networkParams.dataPackets; i++) {
            // Choose a random connection
            const connectionIndex = Math.floor(Math.random() * this.connections.length);
            const connection = this.connections[connectionIndex];
            
            // Choose a random color for the data packet
            const colorIndex = Math.floor(Math.random() * this.networkParams.dataPacketColors.length);
            const color = this.networkParams.dataPacketColors[colorIndex];
            
            // Create material with glow effect
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.8,
                shininess: 100
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            
            // Start at source node
            const sourceNode = this.nodes[connection.sourceIndex];
            mesh.position.copy(sourceNode.position);
            
            // Random speed
            const speed = this.networkParams.dataSpeed.min + 
                Math.random() * (this.networkParams.dataSpeed.max - this.networkParams.dataSpeed.min);
            
            // Add to scene
            this.dataPacketsGroup.add(mesh);
            
            // Store data packet information
            this.dataPackets.push({
                mesh: mesh,
                connectionIndex: connectionIndex,
                progress: 0, // 0 = source, 1 = target
                speed: speed,
                color: color
            });
        }
    }
    
    updateNodes(delta, elapsedTime) {
        // Update node pulse effect
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            
            // Pulse size based on sine wave
            const pulse = Math.sin(elapsedTime * this.networkParams.pulseFrequency + node.pulsePhase) * 0.1 + 1;
            
            // Apply pulse
            node.mesh.scale.set(
                node.size * pulse,
                node.size * pulse,
                node.size * pulse
            );
        }
    }
    
    updateConnections(delta, elapsedTime) {
        // Update connection lines
        for (let i = 0; i < this.connections.length; i++) {
            const connection = this.connections[i];
            
            // Pulse opacity for active connections
            if (connection.active) {
                const pulseFactor = Math.sin(elapsedTime * connection.pulseSpeed + connection.pulsePhase) * 0.3 + 0.7;
                connection.line.material.opacity = 0.2 + pulseFactor * 0.5;
                
                // Randomly deactivate connections
                if (Math.random() < 0.01) {
                    connection.active = false;
                }
            } else {
                connection.line.material.opacity = 0.2;
                
                // Randomly activate connections
                if (Math.random() < 0.005) {
                    connection.active = true;
                }
            }
        }
    }
    
    updateDataPackets(delta, elapsedTime) {
        // Update data packet positions
        for (let i = 0; i < this.dataPackets.length; i++) {
            const packet = this.dataPackets[i];
            const connection = this.connections[packet.connectionIndex];
            
            // Move along connection path
            packet.progress += packet.speed * delta;
            
            // Reset when reaching the end
            if (packet.progress >= 1) {
                // Choose new random connection
                const newConnectionIndex = Math.floor(Math.random() * this.connections.length);
                const newConnection = this.connections[newConnectionIndex];
                
                // Reset to source position
                const sourceNode = this.nodes[newConnection.sourceIndex];
                packet.mesh.position.copy(sourceNode.position);
                
                // Update packet data
                packet.connectionIndex = newConnectionIndex;
                packet.progress = 0;
                
                // Activate the connection
                newConnection.active = true;
            } else {
                // Calculate current position along the path
                const sourceNode = this.nodes[connection.sourceIndex];
                const targetNode = this.nodes[connection.targetIndex];
                
                // Interpolate between source and target
                packet.mesh.position.lerpVectors(
                    sourceNode.position,
                    targetNode.position,
                    packet.progress
                );
            }
        }
    }
}

export default DataFlowNetworkAnimation; 