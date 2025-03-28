import ThreeJSSetup from './setup.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

class DigitalTwinAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for digital twin animation
        const defaultOptions = {
            backgroundColor: 0x05071F,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 0.7,
            bloomRadius: 0.4,
            bloomThreshold: 0.3,
            cameraZ: 100,
            cameraY: 80,
            cameraX: 80,
            controlsConfig: {
                enableZoom: true,
                enablePan: true,
                maxPolarAngle: Math.PI / 2 - 0.1,
                minPolarAngle: Math.PI / 8,
                maxDistance: 200,
                minDistance: 30
            }
        };
        
        super(containerId, {...defaultOptions, ...options});
        
        // Digital twin parameters
        this.citySize = options.citySize || 200;
        this.gridDivisions = options.gridDivisions || 20;
        this.buildingColors = {
            primary: 0x1E2761,
            secondary: 0x408EC6,
            accent: 0x7A2048,
            ground: 0x1A2639,
            roads: 0x0D1321,
            highlight: 0x2DE2E6,
            aiAgents: 0xFF3864
        };
        
        // Initialize the digital twin environment
        this.initializeEnvironment();
        
        // Set up AI agents and animations
        this.setupAgentAnimations();
        
        // Start the animation loop
        this.animate();
    }
    
    initializeEnvironment() {
        // Add ambient and directional lights
        this.lights = this.addLights();
        this.lights.ambientLight.intensity = 0.2;
        
        // Create directional light for shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        
        // Configure shadow settings
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 10;
        directionalLight.shadow.camera.far = 300;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        
        this.scene.add(directionalLight);
        this.renderer.shadowMap.enabled = true;
        
        // Create city ground
        this.createCityGround();
        
        // Create city grid (roads)
        this.createCityGrid();
        
        // Create buildings
        this.createBuildings();
        
        // Create special structures (data centers, utility nodes)
        this.createSpecialStructures();
    }
    
    createCityGround() {
        // Create a ground plane
        const groundGeometry = new THREE.PlaneGeometry(this.citySize, this.citySize);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.ground,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        
        this.scene.add(ground);
    }
    
    createCityGrid() {
        // Create city grid for roads
        this.roads = new THREE.Group();
        this.scene.add(this.roads);
        
        const cellSize = this.citySize / this.gridDivisions;
        const roadWidth = cellSize * 0.3;
        
        // Create horizontal and vertical roads
        for (let i = 0; i <= this.gridDivisions; i++) {
            const position = -this.citySize / 2 + i * cellSize;
            
            // Horizontal road
            const horizontalRoad = this.createRoad(this.citySize, roadWidth);
            horizontalRoad.position.set(0, 0, position);
            this.roads.add(horizontalRoad);
            
            // Vertical road
            const verticalRoad = this.createRoad(roadWidth, this.citySize);
            verticalRoad.position.set(position, 0, 0);
            this.roads.add(verticalRoad);
        }
        
        // Store grid cell size for building placement
        this.cellSize = cellSize;
    }
    
    createRoad(width, length) {
        // Create a road segment
        const roadGeometry = new THREE.PlaneGeometry(width, length);
        const roadMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.roads,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.y = -0.4;
        road.receiveShadow = true;
        
        return road;
    }
    
    createBuildings() {
        // Create a group for all buildings
        this.buildings = new THREE.Group();
        this.scene.add(this.buildings);
        
        // Define building types
        this.buildingTypes = [
            { name: 'skyscraper', heightRange: [15, 30], scaleRange: [0.6, 0.8], probability: 0.2 },
            { name: 'office', heightRange: [8, 15], scaleRange: [0.7, 0.9], probability: 0.3 },
            { name: 'apartment', heightRange: [5, 10], scaleRange: [0.8, 1], probability: 0.4 },
            { name: 'lowrise', heightRange: [2, 5], scaleRange: [0.9, 1.2], probability: 0.5 }
        ];
        
        // Place buildings in a grid pattern (avoiding roads)
        const offset = this.cellSize / 2;
        const buildingSize = this.cellSize * 0.6; // 60% of cell size to leave space for roads
        
        // Store all building data for later reference
        this.allBuildings = [];
        
        for (let x = 0; x < this.gridDivisions; x++) {
            for (let z = 0; z < this.gridDivisions; z++) {
                // Skip some cells randomly to create open spaces
                if (Math.random() > 0.75) continue;
                
                // Position in the grid
                const posX = -this.citySize / 2 + offset + x * this.cellSize;
                const posZ = -this.citySize / 2 + offset + z * this.cellSize;
                
                // Choose building type based on probabilities
                const buildingType = this.chooseBuildingType();
                
                // Create and place building
                const building = this.createBuilding(buildingType, buildingSize, posX, posZ);
                this.buildings.add(building.group);
                this.allBuildings.push(building);
            }
        }
    }
    
    chooseBuildingType() {
        // Choose a random building type based on probabilities
        const randomValue = Math.random();
        let cumulativeProbability = 0;
        
        for (const type of this.buildingTypes) {
            cumulativeProbability += type.probability;
            if (randomValue <= cumulativeProbability) {
                return type;
            }
        }
        
        // Default to the last type if none is selected
        return this.buildingTypes[this.buildingTypes.length - 1];
    }
    
    createBuilding(buildingType, baseSize, x, z) {
        // Create a building based on its type
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        
        // Randomize building properties based on type
        const scale = baseSize * (buildingType.scaleRange[0] + Math.random() * (buildingType.scaleRange[1] - buildingType.scaleRange[0]));
        const height = buildingType.heightRange[0] + Math.random() * (buildingType.heightRange[1] - buildingType.heightRange[0]);
        
        // Randomize building shape slightly to avoid uniformity
        const width = scale * (0.8 + Math.random() * 0.4);
        const depth = scale * (0.8 + Math.random() * 0.4);
        
        // Select building color based on type
        let color = this.buildingColors.primary;
        if (buildingType.name === 'skyscraper') {
            color = this.buildingColors.secondary;
        } else if (buildingType.name === 'apartment') {
            color = 0x27496D; // A slightly different blue
        } else if (buildingType.name === 'lowrise') {
            color = 0x25394B; // Darker blue
        }
        
        // Create main building shape
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.7,
            metalness: 0.3
        });
        
        const building = new THREE.Mesh(geometry, material);
        building.position.y = height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        
        group.add(building);
        
        // Add windows to the building
        this.addBuildingWindows(building, width, height, depth);
        
        // For skyscrapers, add a highlight on top
        if (buildingType.name === 'skyscraper') {
            const antennaHeight = 2 + Math.random() * 3;
            
            const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, antennaHeight, 8);
            const antennaMaterial = new THREE.MeshStandardMaterial({
                color: this.buildingColors.highlight,
                emissive: this.buildingColors.highlight,
                emissiveIntensity: 0.7
            });
            
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.y = height + antennaHeight / 2;
            group.add(antenna);
            
            // Add a pulsing light on top of the skyscraper
            const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const lightMaterial = new THREE.MeshBasicMaterial({
                color: this.buildingColors.highlight,
                transparent: true,
                opacity: 0.9
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.y = height + antennaHeight + 0.2;
            group.add(light);
            
            // Animate the light
            gsap.to(light.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            // Store light reference for later animation
            building.light = light;
        }
        
        // Return building data
        return {
            group,
            mesh: building,
            type: buildingType,
            position: new THREE.Vector3(x, 0, z),
            width,
            height,
            depth
        };
    }
    
    addBuildingWindows(building, width, height, depth) {
        // Add windows to building sides
        // Window properties
        const windowSize = 0.6;
        const windowSpacing = 1.2;
        
        // Calculate number of windows based on building dimensions
        const windowCountX = Math.max(1, Math.floor(width / windowSpacing));
        const windowCountY = Math.max(2, Math.floor(height / windowSpacing));
        const windowCountZ = Math.max(1, Math.floor(depth / windowSpacing));
        
        // Window material
        const windowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFE4A7,
            transparent: true,
            opacity: 0.7
        });
        
        // Create windows for each side
        const sides = [
            { direction: 'front', axis: 'z', value: depth / 2 + 0.01, uAxis: 'x', vAxis: 'y', uCount: windowCountX, vCount: windowCountY },
            { direction: 'back', axis: 'z', value: -depth / 2 - 0.01, uAxis: 'x', vAxis: 'y', uCount: windowCountX, vCount: windowCountY },
            { direction: 'left', axis: 'x', value: width / 2 + 0.01, uAxis: 'z', vAxis: 'y', uCount: windowCountZ, vCount: windowCountY },
            { direction: 'right', axis: 'x', value: -width / 2 - 0.01, uAxis: 'z', vAxis: 'y', uCount: windowCountZ, vCount: windowCountY }
        ];
        
        sides.forEach(side => {
            // Start position for windows grid
            const uStart = -(side.uCount * windowSpacing) / 2 + windowSpacing / 2;
            const vStart = windowSpacing / 2;
            
            for (let u = 0; u < side.uCount; u++) {
                for (let v = 0; v < side.vCount; v++) {
                    // Skip some windows randomly for variety
                    if (Math.random() > 0.7) continue;
                    
                    // Create window
                    const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
                    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial.clone());
                    
                    // Position window
                    const uPos = uStart + u * windowSpacing;
                    const vPos = vStart + v * windowSpacing;
                    
                    // Set position based on the side
                    const position = new THREE.Vector3();
                    position[side.axis] = side.value;
                    position[side.uAxis] = uPos;
                    position[side.vAxis] = vPos;
                    
                    windowMesh.position.copy(position);
                    
                    // Set rotation based on the side
                    if (side.axis === 'z') {
                        windowMesh.rotation.y = (side.value > 0) ? 0 : Math.PI;
                    } else {
                        windowMesh.rotation.y = (side.value > 0) ? Math.PI / 2 : -Math.PI / 2;
                    }
                    
                    // Add window
                    building.add(windowMesh);
                    
                    // Add random window light animation
                    if (Math.random() > 0.7) {
                        gsap.to(windowMesh.material, {
                            opacity: 0.1 + Math.random() * 0.3,
                            duration: 1 + Math.random() * 3,
                            repeat: -1,
                            yoyo: true,
                            delay: Math.random() * 2,
                            ease: "sine.inOut"
                        });
                    }
                }
            }
        });
    }
    
    createSpecialStructures() {
        // Create special structures (data centers, utility nodes, etc.)
        this.specialStructures = new THREE.Group();
        this.scene.add(this.specialStructures);
        
        // Data center (larger building with more lights)
        const dataCenterGeometry = new THREE.BoxGeometry(15, 8, 15);
        const dataCenterMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.accent,
            roughness: 0.5,
            metalness: 0.5
        });
        
        const dataCenter = new THREE.Mesh(dataCenterGeometry, dataCenterMaterial);
        dataCenter.position.set(-this.citySize / 4, 4, -this.citySize / 4);
        dataCenter.castShadow = true;
        dataCenter.receiveShadow = true;
        
        this.specialStructures.add(dataCenter);
        
        // Add server racks on top (represented as small blocks)
        for (let i = 0; i < 5; i++) {
            const rackGeometry = new THREE.BoxGeometry(2, 1, 2);
            const rackMaterial = new THREE.MeshStandardMaterial({
                color: 0x333333,
                roughness: 0.7,
                metalness: 0.7
            });
            
            const rack = new THREE.Mesh(rackGeometry, rackMaterial);
            rack.position.set(
                -3 + i * 1.5,
                8.5,
                0
            );
            
            dataCenter.add(rack);
            
            // Add blinking server lights
            const lightGeometry = new THREE.PlaneGeometry(0.1, 0.1);
            const lightColors = [0x00ff00, 0xff0000, 0x0000ff, 0xffff00];
            
            for (let j = 0; j < 3; j++) {
                const lightMaterial = new THREE.MeshBasicMaterial({
                    color: lightColors[Math.floor(Math.random() * lightColors.length)],
                    side: THREE.DoubleSide
                });
                
                const light = new THREE.Mesh(lightGeometry, lightMaterial);
                light.position.set(0, 0.51, -0.5 + j * 0.5);
                light.rotation.x = -Math.PI / 2;
                
                rack.add(light);
                
                // Blink animation
                gsap.to(light.material, {
                    opacity: 0.2,
                    duration: 0.2 + Math.random() * 0.5,
                    repeat: -1,
                    yoyo: true,
                    delay: Math.random(),
                    ease: "steps(1)"
                });
            }
        }
        
        // Central AI control tower
        const towerHeight = 40;
        const towerBaseGeometry = new THREE.CylinderGeometry(8, 10, 6, 16);
        const towerBaseMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.secondary,
            roughness: 0.6,
            metalness: 0.4
        });
        
        const towerBase = new THREE.Mesh(towerBaseGeometry, towerBaseMaterial);
        towerBase.position.set(0, 3, 0);
        
        const towerBodyGeometry = new THREE.CylinderGeometry(4, 8, towerHeight - 10, 16);
        const towerBodyMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.primary,
            roughness: 0.6,
            metalness: 0.4
        });
        
        const towerBody = new THREE.Mesh(towerBodyGeometry, towerBodyMaterial);
        towerBody.position.set(0, towerHeight / 2, 0);
        
        const towerTopGeometry = new THREE.CylinderGeometry(1, 4, 4, 16);
        const towerTopMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.highlight,
            emissive: this.buildingColors.highlight,
            emissiveIntensity: 0.5,
            roughness: 0.4,
            metalness: 0.6
        });
        
        const towerTop = new THREE.Mesh(towerTopGeometry, towerTopMaterial);
        towerTop.position.set(0, towerHeight - 2, 0);
        
        // Create tower group
        const tower = new THREE.Group();
        tower.add(towerBase);
        tower.add(towerBody);
        tower.add(towerTop);
        
        // Add pulsing light on top
        const beaconGeometry = new THREE.SphereGeometry(1.5, 16, 16);
        const beaconMaterial = new THREE.MeshBasicMaterial({
            color: this.buildingColors.highlight,
            transparent: true,
            opacity: 0.9
        });
        
        const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
        beacon.position.set(0, towerHeight + 1, 0);
        tower.add(beacon);
        
        // Pulse animation for beacon
        gsap.to(beacon.scale, {
            x: 1.5, y: 1.5, z: 1.5,
            duration: 2,
            repeat: -1,
            yoyo: true
        });
        
        // Add rotating ring around tower
        const ringGeometry = new THREE.TorusGeometry(12, 0.5, 16, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.highlight,
            emissive: this.buildingColors.highlight,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.8
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = towerHeight / 2;
        tower.add(ring);
        
        // Rotate the ring
        gsap.to(ring.rotation, {
            z: Math.PI * 2,
            duration: 20,
            repeat: -1,
            ease: "none"
        });
        
        // Add second ring at different angle
        const ring2 = ring.clone();
        ring2.rotation.x = Math.PI / 4;
        ring2.rotation.z = Math.PI / 4;
        ring2.scale.set(0.8, 0.8, 0.8);
        tower.add(ring2);
        
        // Rotate the second ring in opposite direction
        gsap.to(ring2.rotation, {
            y: Math.PI * 2,
            duration: 15,
            repeat: -1,
            ease: "none"
        });
        
        // Add tower to scene
        this.specialStructures.add(tower);
        this.controlTower = tower;
        this.controlTowerBeacon = beacon;
    }
    
    setupAgentAnimations() {
        // Create AI agents that move through the city
        this.agents = [];
        
        // Create agent model (simple glowing sphere)
        const agentGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const agentMaterial = new THREE.MeshStandardMaterial({
            color: this.buildingColors.aiAgents,
            emissive: this.buildingColors.aiAgents,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.9
        });
        
        // Generate paths for agents
        const paths = this.generateAgentPaths();
        
        // Create agents along the paths
        const agentCount = 30;
        for (let i = 0; i < agentCount; i++) {
            const agent = new THREE.Mesh(agentGeometry, agentMaterial.clone());
            
            // Add glow effect
            const agentGlow = this.createGlowSprite(this.buildingColors.aiAgents);
            agent.add(agentGlow);
            
            // Add data trail effect
            const trailGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const trailMaterial = new THREE.MeshBasicMaterial({
                color: this.buildingColors.aiAgents,
                transparent: true,
                opacity: 0.5
            });
            
            const trail = [];
            const trailLength = 10;
            
            for (let j = 0; j < trailLength; j++) {
                const trailSegment = new THREE.Mesh(trailGeometry, trailMaterial.clone());
                trailSegment.visible = false;
                this.scene.add(trailSegment);
                trail.push(trailSegment);
            }
            
            // Choose a random path for this agent
            const pathIndex = Math.floor(Math.random() * paths.length);
            const selectedPath = paths[pathIndex];
            
            // Random starting position along the path
            const progress = Math.random();
            const position = selectedPath.getPointAt(progress);
            
            // Position agent slightly above the ground
            position.y = 1;
            agent.position.copy(position);
            
            // Add to scene
            this.scene.add(agent);
            
            // Add to agents array with metadata
            this.agents.push({
                mesh: agent,
                glow: agentGlow,
                path: selectedPath,
                progress,
                speed: 0.0005 + Math.random() * 0.001,
                trail,
                trailTimer: 0,
                trailUpdateInterval: 0.1,
                lastTrailPoint: position.clone()
            });
        }
        
        // Set up periodic events
        this.eventTimers = {
            beaconPulse: 0,
            beaconPulseInterval: 10,
            agentBurst: 0,
            agentBurstInterval: 15
        };
        
        // Set up update function
        this.update = (delta, elapsedTime) => {
            // Update agents
            this.updateAgents(delta, elapsedTime);
            
            // Trigger periodic events
            this.triggerPeriodicEvents(elapsedTime);
        };
    }
    
    generateAgentPaths() {
        // Generate paths for agents to follow
        const paths = [];
        
        // Create paths along the grid
        const gridStep = this.citySize / this.gridDivisions;
        const roadOffset = 1; // Slight offset to position agents on the roads
        
        // Horizontal paths
        for (let i = 0; i <= this.gridDivisions; i++) {
            const z = -this.citySize / 2 + i * gridStep;
            
            // Create a path from left to right
            const pathPoints = [
                new THREE.Vector3(-this.citySize / 2, 1, z + roadOffset),
                new THREE.Vector3(this.citySize / 2, 1, z + roadOffset)
            ];
            
            const curve = new THREE.LineCurve3(pathPoints[0], pathPoints[1]);
            paths.push(curve);
            
            // Create a path from right to left
            const reversePath = new THREE.LineCurve3(pathPoints[1], pathPoints[0]);
            paths.push(reversePath);
        }
        
        // Vertical paths
        for (let i = 0; i <= this.gridDivisions; i++) {
            const x = -this.citySize / 2 + i * gridStep;
            
            // Create a path from top to bottom
            const pathPoints = [
                new THREE.Vector3(x + roadOffset, 1, -this.citySize / 2),
                new THREE.Vector3(x + roadOffset, 1, this.citySize / 2)
            ];
            
            const curve = new THREE.LineCurve3(pathPoints[0], pathPoints[1]);
            paths.push(curve);
            
            // Create a path from bottom to top
            const reversePath = new THREE.LineCurve3(pathPoints[1], pathPoints[0]);
            paths.push(reversePath);
        }
        
        // Add circular path around the control tower
        const circlePoints = [];
        const circleRadius = 25;
        const circleSegments = 32;
        
        for (let i = 0; i <= circleSegments; i++) {
            const angle = (i / circleSegments) * Math.PI * 2;
            const x = Math.cos(angle) * circleRadius;
            const z = Math.sin(angle) * circleRadius;
            circlePoints.push(new THREE.Vector3(x, 1, z));
        }
        
        const circleCurve = new THREE.CatmullRomCurve3(circlePoints, true);
        paths.push(circleCurve);
        
        return paths;
    }
    
    updateAgents(delta, elapsedTime) {
        // Update each agent's position and trail
        this.agents.forEach(agent => {
            // Update progress along path
            agent.progress += agent.speed * delta * 60;
            
            // Wrap progress to keep it between 0 and 1
            agent.progress = agent.progress % 1;
            
            // Get new position
            const newPosition = agent.path.getPointAt(agent.progress);
            
            // Calculate direction for smooth movement
            const tangent = agent.path.getTangent(agent.progress);
            const lookTarget = newPosition.clone().add(tangent);
            
            // Update position
            agent.mesh.position.copy(newPosition);
            agent.mesh.lookAt(lookTarget);
            
            // Update trail
            agent.trailTimer += delta;
            if (agent.trailTimer >= agent.trailUpdateInterval) {
                agent.trailTimer = 0;
                
                // Shift all trail segments
                for (let i = agent.trail.length - 1; i > 0; i--) {
                    agent.trail[i].position.copy(agent.trail[i-1].position);
                    agent.trail[i].visible = agent.trail[i-1].visible;
                    
                    // Fade out trail segments
                    agent.trail[i].material.opacity = 0.5 * (1 - i / agent.trail.length);
                    agent.trail[i].scale.set(
                        0.8 * (1 - i / agent.trail.length),
                        0.8 * (1 - i / agent.trail.length),
                        0.8 * (1 - i / agent.trail.length)
                    );
                }
                
                // Update first trail segment to current position
                agent.trail[0].position.copy(agent.mesh.position);
                agent.trail[0].visible = true;
                
                // Save last trail point
                agent.lastTrailPoint.copy(agent.mesh.position);
            }
            
            // Subtle pulsing effect for agents
            const scale = 0.9 + 0.2 * Math.sin(elapsedTime * 3 + agent.progress * 10);
            agent.glow.scale.set(scale, scale, scale);
        });
    }
    
    triggerPeriodicEvents(elapsedTime) {
        // Beacon pulse event
        if (elapsedTime - this.eventTimers.beaconPulse > this.eventTimers.beaconPulseInterval) {
            this.eventTimers.beaconPulse = elapsedTime;
            this.triggerBeaconPulse();
        }
        
        // Agent burst event
        if (elapsedTime - this.eventTimers.agentBurst > this.eventTimers.agentBurstInterval) {
            this.eventTimers.agentBurst = elapsedTime;
            this.triggerAgentBurst();
        }
    }
    
    triggerBeaconPulse() {
        // Create a pulse effect from the control tower
        const pulseGeometry = new THREE.SphereGeometry(5, 32, 32);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: this.buildingColors.highlight,
            transparent: true,
            opacity: 0.7
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulse.position.copy(this.controlTowerBeacon.position.clone());
        pulse.position.y = 40;
        this.scene.add(pulse);
        
        // Animate the pulse outward
        gsap.to(pulse.scale, {
            x: 20,
            y: 5,
            z: 20,
            duration: 4,
            ease: "power1.out"
        });
        
        gsap.to(pulse.material, {
            opacity: 0,
            duration: 4,
            ease: "power1.out",
            onComplete: () => {
                // Remove the pulse when animation completes
                this.scene.remove(pulse);
                pulse.geometry.dispose();
                pulse.material.dispose();
            }
        });
        
        // Animate the beacon
        gsap.to(this.controlTowerBeacon.scale, {
            x: 2.5,
            y: 2.5,
            z: 2.5,
            duration: 0.5,
            yoyo: true,
            repeat: 1
        });
        
        // Activate a random set of buildings with a data burst
        const buildingCount = Math.floor(5 + Math.random() * 10);
        const selectedBuildings = [];
        
        // Select random buildings
        for (let i = 0; i < buildingCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.allBuildings.length);
            selectedBuildings.push(this.allBuildings[randomIndex]);
        }
        
        // Activate these buildings
        selectedBuildings.forEach(building => {
            // Highlight building
            const originalColor = building.mesh.material.color.clone();
            const originalEmissive = building.mesh.material.emissive ? building.mesh.material.emissive.clone() : new THREE.Color(0x000000);
            
            gsap.to(building.mesh.material.emissive, {
                r: this.buildingColors.highlight >> 16 & 255 / 255,
                g: this.buildingColors.highlight >> 8 & 255 / 255,
                b: this.buildingColors.highlight & 255 / 255,
                duration: 0.5,
                onComplete: () => {
                    gsap.to(building.mesh.material.emissive, {
                        r: originalEmissive.r,
                        g: originalEmissive.g,
                        b: originalEmissive.b,
                        duration: 1
                    });
                }
            });
        });
    }
    
    triggerAgentBurst() {
        // Trigger a burst of activity among the agents
        // Make agents move faster temporarily
        this.agents.forEach(agent => {
            // Speed up agent
            const originalSpeed = agent.speed;
            agent.speed *= 3;
            
            // Increase glow
            gsap.to(agent.mesh.material, {
                emissiveIntensity: 1,
                duration: 0.5
            });
            
            // Restore original speed after a delay
            setTimeout(() => {
                agent.speed = originalSpeed;
                
                gsap.to(agent.mesh.material, {
                    emissiveIntensity: 0.7,
                    duration: 1
                });
            }, 3000 + Math.random() * 2000);
        });
        
        // Create data burst effect from control tower to random buildings
        const burstCount = 5 + Math.floor(Math.random() * 10);
        const towerPosition = new THREE.Vector3(0, 40, 0);
        
        for (let i = 0; i < burstCount; i++) {
            // Select random building
            const randomIndex = Math.floor(Math.random() * this.allBuildings.length);
            const targetBuilding = this.allBuildings[randomIndex];
            
            // Create data packet
            const packetGeometry = new THREE.SphereGeometry(0.6, 8, 8);
            const packetMaterial = new THREE.MeshBasicMaterial({
                color: this.buildingColors.highlight,
                transparent: true,
                opacity: 0.9
            });
            
            const packet = new THREE.Mesh(packetGeometry, packetMaterial);
            packet.position.copy(towerPosition);
            
            // Add glowing effect
            const packetGlow = this.createGlowSprite(this.buildingColors.highlight);
            packetGlow.scale.set(2, 2, 2);
            packet.add(packetGlow);
            
            this.scene.add(packet);
            
            // Target position (adjusted for building height)
            const targetPosition = targetBuilding.position.clone();
            targetPosition.y = targetBuilding.height + 1;
            
            // Animate to target
            gsap.to(packet.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1 + Math.random(),
                delay: i * 0.2,
                ease: "power2.inOut",
                onComplete: () => {
                    // Remove packet
                    this.scene.remove(packet);
                    packet.geometry.dispose();
                    packet.material.dispose();
                    
                    // Activation effect at target
                    this.createBuildingActivationEffect(targetBuilding);
                }
            });
        }
    }
    
    createBuildingActivationEffect(building) {
        // Create an activation effect when a building receives data
        // Pulse effect around building
        const pulseGeometry = new THREE.SphereGeometry(2, 16, 16);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: this.buildingColors.highlight,
            transparent: true,
            opacity: 0.6
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        pulse.position.copy(building.position);
        pulse.position.y = building.height / 2;
        this.scene.add(pulse);
        
        // Animate pulse outward
        gsap.to(pulse.scale, {
            x: 3,
            y: 3,
            z: 3,
            duration: 1,
            ease: "power1.out"
        });
        
        gsap.to(pulse.material, {
            opacity: 0,
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                // Remove the pulse
                this.scene.remove(pulse);
                pulse.geometry.dispose();
                pulse.material.dispose();
            }
        });
        
        // Highlight the building
        const originalEmissive = building.mesh.material.emissive.clone();
        const originalEmissiveIntensity = building.mesh.material.emissiveIntensity;
        
        building.mesh.material.emissive.set(this.buildingColors.highlight);
        building.mesh.material.emissiveIntensity = 0.5;
        
        // Restore original appearance
        setTimeout(() => {
            gsap.to(building.mesh.material, {
                emissiveIntensity: originalEmissiveIntensity,
                duration: 1,
                onComplete: () => {
                    building.mesh.material.emissive.copy(originalEmissive);
                }
            });
        }, 500);
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
        sprite.scale.set(3, 3, 3);
        
        return sprite;
    }
}

export default DigitalTwinAnimation; 