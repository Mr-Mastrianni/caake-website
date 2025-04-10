import ThreeJSSetup from './setup.js';
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { handleError } from '../utils/error-handler.js';

class WorkflowAutomationAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        try { // Wrap constructor
            // Set default options for workflow animation
            const defaultOptions = {
                backgroundColor: 0x1a1a2e,
                transparent: true,
                orbitControls: true,
                postprocessing: true,
                bloom: true,
                bloomStrength: 0.8,
                bloomRadius: 0.5,
                bloomThreshold: 0.4,
                cameraZ: 20,
                cameraY: 15,
                cameraX: 15,
                controlsConfig: {
                    enableZoom: true,
                    enablePan: true,
                    maxPolarAngle: Math.PI / 2 - 0.1,
                    minPolarAngle: Math.PI / 6,
                    maxDistance: 50,
                    minDistance: 10
                }
            };
            
            super(containerId, {...defaultOptions, ...options});
            
            // Workflow scene parameters
            this.gridSize = options.gridSize || 30;
            this.buildingColors = {
                department1: 0x16213e,  // Dark blue
                department2: 0x533483,  // Purple
                department3: 0x0f3460,  // Navy
                department4: 0x1e5128,  // Green
                roof: 0x1e2022,         // Dark gray
                ground: 0x0f0f1b,       // Very dark blue
                paths: 0x2c394b,        // Medium blue
                highlight: 0x00bfff,     // Light blue
                dataParticles: 0x4cc9f0  // Cyan
            };
            
            // Initialize the workflow scene
            this.initializeScene();
            
            // Set up the automated workflow animations
            this.setupWorkflowAnimations();
            
            // Start the animation loop
            this.animate();
        } catch (error) {
            handleError(error, 'Error during WorkflowAutomationAnimation construction');
            if (this.renderer) this.dispose();
        }
    }
    
    initializeScene() {
        try { // Wrap scene initialization
            // Add ambient and directional lights
            this.lights = this.addLights();
            this.lights.ambientLight.intensity = 0.3;
            
            // Create directional light for shadows
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(20, 30, 20);
            directionalLight.castShadow = true;
            
            // Configure shadow settings
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = 100;
            directionalLight.shadow.camera.left = -30;
            directionalLight.shadow.camera.right = 30;
            directionalLight.shadow.camera.top = 30;
            directionalLight.shadow.camera.bottom = -30;
            
            this.scene.add(directionalLight);
            this.renderer.shadowMap.enabled = true;
            
            // Create ground plane
            this.createGround();
            
            // Create building departments
            this.createDepartments();
            
            // Create connecting paths
            this.createPaths();
            
            // Create data particles
            this.createDataParticles();
        } catch (error) {
            handleError(error, 'Error initializing workflow automation scene');
        }
    }
    
    createGround() {
        // Create a ground plane
        const groundGeometry = new THREE.PlaneGeometry(this.gridSize, this.gridSize);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.ground,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.2;
        ground.receiveShadow = true;
        
        this.scene.add(ground);
        
        // Add grid helper
        const gridHelper = new THREE.GridHelper(this.gridSize, this.gridSize / 2, 0x444444, 0x222222);
        gridHelper.position.y = -0.19;
        this.scene.add(gridHelper);
    }
    
    createDepartments() {
        this.departments = [];
        
        // Define department data
        const departmentData = [
            { 
                id: 'department1', 
                name: 'Input', 
                position: [-10, 0, -8], 
                size: [4, 2, 4],
                color: this.buildingColors.department1
            },
            { 
                id: 'department2', 
                name: 'Processing', 
                position: [0, 0, 0], 
                size: [8, 3, 8],
                color: this.buildingColors.department2
            },
            { 
                id: 'department3', 
                name: 'Analysis', 
                position: [10, 0, 8], 
                size: [6, 4, 6],
                color: this.buildingColors.department3
            },
            { 
                id: 'department4', 
                name: 'Output', 
                position: [0, 0, -10], 
                size: [5, 2.5, 5],
                color: this.buildingColors.department4
            }
        ];
        
        // Create each department
        departmentData.forEach(dept => {
            const department = this.createBuilding(dept);
            this.departments.push(department);
        });
    }
    
    createBuilding(departmentData) {
        const { id, name, position, size, color } = departmentData;
        
        // Create building group
        const buildingGroup = new THREE.Group();
        buildingGroup.position.set(...position);
        
        // Create main building
        const buildingGeometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.y = size[1] / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        
        // Create roof
        const roofGeometry = new THREE.BoxGeometry(size[0] + 0.5, 0.5, size[2] + 0.5);
        const roofMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.roof,
            roughness: 0.6,
            metalness: 0.4
        });
        
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = size[1] + 0.25;
        roof.castShadow = true;
        
        // Add label
        const labelPosition = [0, size[1] + 1, 0];
        const label = this.createTextLabel(name, labelPosition);
        
        // Create antenna or highlight feature on top
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.highlight,
            emissive: this.buildingColors.highlight,
            emissiveIntensity: 0.5
        });
        
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(size[0]/4, size[1] + 1, size[2]/4);
        
        // Add spherical tip to antenna
        const tipGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const tipMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.highlight,
            emissive: this.buildingColors.highlight,
            emissiveIntensity: 1
        });
        
        const antennaTip = new THREE.Mesh(tipGeometry, tipMaterial);
        antennaTip.position.y = 0.8;
        antenna.add(antennaTip);
        
        // Add windows
        this.addWindowsToBuilding(building, size);
        
        // Add components to building group
        buildingGroup.add(building);
        buildingGroup.add(roof);
        buildingGroup.add(antenna);
        
        // Save reference to building parts
        const buildingData = {
            id,
            group: buildingGroup,
            building,
            roof,
            antenna,
            antennaTip,
            position: new THREE.Vector3(...position),
            size,
            connectionPoints: this.generateConnectionPoints(position, size)
        };
        
        this.scene.add(buildingGroup);
        return buildingData;
    }
    
    createTextLabel(text, position) {
        // This is a placeholder - in a real implementation, we'd use a TextGeometry
        // or HTML/CSS overlay for text labels
        // For this implementation, we'll use a simple point to represent the label
        const labelGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const labelMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(...position);
        
        return label;
    }
    
    addWindowsToBuilding(building, size) {
        // Generate windows on each side of the building
        const sides = [
            { dir: 'front', rotation: [0, 0, 0], offset: [0, 0, size[2]/2 + 0.01] },
            { dir: 'back', rotation: [0, Math.PI, 0], offset: [0, 0, -size[2]/2 - 0.01] },
            { dir: 'left', rotation: [0, Math.PI/2, 0], offset: [size[0]/2 + 0.01, 0, 0] },
            { dir: 'right', rotation: [0, -Math.PI/2, 0], offset: [-size[0]/2 - 0.01, 0, 0] }
        ];
        
        sides.forEach(side => {
            // Calculate number of windows based on building size
            const horizWindows = Math.max(1, Math.floor(size[0] / 1.5));
            const vertWindows = Math.max(1, Math.floor(size[1] / 1.2));
            
            // Window properties
            const windowWidth = 0.6;
            const windowHeight = 0.8;
            const windowDepth = 0.05;
            const spacing = 0.4;
            
            // Calculate starting position
            const startX = -(horizWindows * (windowWidth + spacing) - spacing) / 2;
            const startY = 1;  // Starting height from ground
            
            // Create windows grid
            for (let row = 0; row < vertWindows; row++) {
                for (let col = 0; col < horizWindows; col++) {
                    // Create window
                    const windowGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
                    
                    // Window glow material with random intensity
                    const glowIntensity = 0.3 + Math.random() * 0.7;
                    const windowMaterial = new THREE.MeshBasicMaterial({
                        color: 0xffff99,
                        transparent: true,
                        opacity: 0.7 * glowIntensity
                    });
                    
                    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                    
                    // Position window
                    const x = startX + col * (windowWidth + spacing);
                    const y = startY + row * (windowHeight + spacing);
                    
                    windowMesh.position.set(x, y, 0);
                    windowMesh.rotation.set(...side.rotation);
                    windowMesh.position.add(new THREE.Vector3(...side.offset));
                    
                    // Slightly randomize window properties
                    windowMesh.scale.set(
                        0.9 + Math.random() * 0.2,
                        0.9 + Math.random() * 0.2,
                        1
                    );
                    
                    // Animate window glow
                    if (Math.random() > 0.7) {
                        // Create flicker effect for some windows
                        this.animateWindowGlow(windowMesh);
                    }
                    
                    building.add(windowMesh);
                }
            }
        });
    }
    
    animateWindowGlow(windowMesh) {
        // Animate window glow with a flicker effect
        const duration = 1 + Math.random() * 3;
        const delay = Math.random() * 2;
        
        gsap.to(windowMesh.material, {
            opacity: 0.1 + Math.random() * 0.2,
            duration: duration,
            delay: delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    generateConnectionPoints(position, size) {
        // Generate connection points at the edges of the building
        return {
            top: new THREE.Vector3(position[0], position[1] + size[1], position[2]),
            north: new THREE.Vector3(position[0], position[1] + 0.5, position[2] - size[2]/2),
            south: new THREE.Vector3(position[0], position[1] + 0.5, position[2] + size[2]/2),
            east: new THREE.Vector3(position[0] + size[0]/2, position[1] + 0.5, position[2]),
            west: new THREE.Vector3(position[0] - size[0]/2, position[1] + 0.5, position[2])
        };
    }
    
    createPaths() {
        // Define the connections between departments
        this.pathConnections = [
            {
                from: 'department1',    // Input
                to: 'department2',      // Processing
                fromPoint: 'south',
                toPoint: 'west'
            },
            {
                from: 'department2',    // Processing
                to: 'department3',      // Analysis
                fromPoint: 'east',
                toPoint: 'north'
            },
            {
                from: 'department2',    // Processing
                to: 'department4',      // Output
                fromPoint: 'north',
                toPoint: 'south'
            },
            {
                from: 'department3',    // Analysis
                to: 'department4',      // Output
                fromPoint: 'west',
                toPoint: 'east'
            }
        ];
        
        // Create path meshes
        this.paths = this.pathConnections.map(connection => {
            return this.createPath(connection);
        });
    }
    
    createPath(connection) {
        // Find the source and target departments
        const sourceDept = this.departments.find(dept => dept.id === connection.from);
        const targetDept = this.departments.find(dept => dept.id === connection.to);
        
        if (!sourceDept || !targetDept) {
            console.error('Department not found:', connection);
            return null;
        }
        
        // Get connection points
        const sourcePoint = sourceDept.connectionPoints[connection.fromPoint].clone();
        const targetPoint = targetDept.connectionPoints[connection.toPoint].clone();
        
        // Adjust height to ground level
        sourcePoint.y = 0;
        targetPoint.y = 0;
        
        // Create path geometry (a curve in 3D space)
        const pathPoints = this.createPathPoints(sourcePoint, targetPoint);
        const curve = new THREE.CatmullRomCurve3(pathPoints);
        
        // Create tube around the curve for the path
        const pathGeometry = new THREE.TubeGeometry(curve, 20, 0.4, 8, false);
        const pathMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.paths,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
        pathMesh.receiveShadow = true;
        
        this.scene.add(pathMesh);
        
        // Return path data
        return {
            mesh: pathMesh,
            curve: curve,
            source: sourceDept,
            target: targetDept,
            sourcePoint: sourcePoint,
            targetPoint: targetPoint,
            particles: []
        };
    }
    
    createPathPoints(sourcePoint, targetPoint) {
        // Create intermediate points for a curved path
        const midPoint = new THREE.Vector3().addVectors(sourcePoint, targetPoint).multiplyScalar(0.5);
        
        // Add a random offset to make the curve more interesting
        midPoint.x += (Math.random() - 0.5) * 3;
        midPoint.z += (Math.random() - 0.5) * 3;
        
        // Ensure the path is slightly above ground
        midPoint.y = 0.1;
        
        // Create a copy of source and target points with slight elevation
        const elevatedSource = sourcePoint.clone();
        const elevatedTarget = targetPoint.clone();
        elevatedSource.y = 0.1;
        elevatedTarget.y = 0.1;
        
        // Return array of points defining the curve
        return [elevatedSource, midPoint, elevatedTarget];
    }
    
    createDataParticles() {
        // Create particle geometry and material
        const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const particleMaterial = new THREE.MeshBasicMaterial({
            color: this.buildingColors.dataParticles,
            transparent: true,
            opacity: 0.9
        });
        
        // Initialize particles array
        this.dataParticles = [];
        
        // For each path, create a set of data particles
        this.paths.forEach(path => {
            const particlesCount = 10 + Math.floor(Math.random() * 5);
            
            for (let i = 0; i < particlesCount; i++) {
                // Create particle
                const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
                
                // Set particle to random position along path
                const t = Math.random();
                const position = path.curve.getPointAt(t);
                particle.position.copy(position);
                
                // Add glowing effect
                const glowSprite = this.createGlowSprite(this.buildingColors.dataParticles);
                particle.add(glowSprite);
                
                // Add to scene
                this.scene.add(particle);
                
                // Store particle data
                const particleData = {
                    mesh: particle,
                    path: path,
                    progress: t,
                    speed: 0.001 + Math.random() * 0.002,
                    glowSprite: glowSprite
                };
                
                this.dataParticles.push(particleData);
                path.particles.push(particleData);
            }
        });
    }
    
    createGlowSprite(color) {
        // Create a sprite with a glow texture
        const spriteMaterial = new THREE.SpriteMaterial({
            map: this.createGlowTexture(),
            color: color,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1, 1, 1);
        
        return sprite;
    }
    
    setupWorkflowAnimations() {
        try { // Wrap animation setup
            // Set up event timing parameters
            this.eventTimers = {
                dataFlow: { interval: 3, lastTrigger: 0, active: false },
                processHighlight: { interval: 5, lastTrigger: 0, active: false },
                statusUpdate: { interval: 7, lastTrigger: 0, active: false }
            };

            // Bind the event trigger function to the class instance
            this.boundTriggerEvents = (delta, elapsedTime) => {
                this.triggerPeriodicEvents(elapsedTime);
            };

            // Initially start the animation logic (could be triggered by user interaction later)
            this.startWorkflow();
        } catch (error) {
            handleError(error, 'Error setting up workflow animations');
        }
    }
    
    // Override update method (called by ThreeJSSetup)
    update(delta, elapsedTime) {
        try { // Wrap update logic
            if (this.boundTriggerEvents) { // Check if setup completed
                this.boundTriggerEvents(delta, elapsedTime);
            }
            
            // Update particles
            if (this.particleSystems) {
                this.particleSystems.forEach(ps => ps.update(delta));
            }
        } catch (error) {
            handleError(error, 'Error in WorkflowAutomationAnimation update loop');
            this.dispose(); // Stop animation
        }
    }
    
    startWorkflow() {
        // ... existing code ...
    }
    
    triggerPeriodicEvents(elapsedTime) {
        // ... existing code ...
    }
}

export default WorkflowAutomationAnimation; 