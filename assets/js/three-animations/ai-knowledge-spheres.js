// import * as THREE from 'three'; // Remove this line
import ThreeJSSetup from './setup.js';

class AIKnowledgeSpheresAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for knowledge spheres animation
        const defaultOptions = {
            backgroundColor: 0x080320,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 0.8,
            bloomRadius: 0.5,
            bloomThreshold: 0.3,
            cameraZ: 20,
            controlsConfig: {
                autoRotate: true,
                autoRotateSpeed: 0.2,
                enableZoom: false,
                maxDistance: 50,
                minDistance: 15
            }
        };
        
        // Merge default options with provided options
        const mergedOptions = { ...defaultOptions, ...options };
        super(containerId, mergedOptions);
        
        // Animation parameters
        this.animParams = {
            // Knowledge domain spheres
            domains: [
                { color: 0x4d88ff, radius: 5, position: new THREE.Vector3(-8, 0, 0), label: "AI", particles: 100 },
                { color: 0xff4d9f, radius: 4, position: new THREE.Vector3(8, 0, 0), label: "ML", particles: 80 },
                { color: 0x44dd88, radius: 3, position: new THREE.Vector3(0, 7, 0), label: "DATA", particles: 60 }
            ],
            // Data points (shared knowledge)
            dataPoints: 200,
            dataPointSize: 0.05,
            // Animation speeds
            rotationSpeed: 0.15,
            dataMigrationSpeed: 0.3,
            pulseFrequency: 0.5
        };
        
        // Initialize the animation
        this.init();
        
        // Start animation loop
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }
    
    init() {
        // Create domain spheres
        this.domains = [];
        this.createDomains();
        
        // Create data points that move between domains
        this.dataPoints = [];
        this.createDataPoints();
        
        // Create connectors between domains
        this.createConnectors();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
        
        // Add main light
        const mainLight = new THREE.PointLight(0xffffff, 1, 100);
        mainLight.position.set(0, 10, 20);
        this.scene.add(mainLight);
        
        // Add secondary light for depth
        const secondaryLight = new THREE.PointLight(0x6666ff, 0.5, 100);
        secondaryLight.position.set(-20, -10, -20);
        this.scene.add(secondaryLight);
        
        // Set up the animation update function
        this.update = (delta, elapsedTime) => {
            this.updateDomains(delta, elapsedTime);
            this.updateDataPoints(delta, elapsedTime);
        };
    }
    
    createDomains() {
        // Create a group to hold all domains
        this.domainsGroup = new THREE.Group();
        this.scene.add(this.domainsGroup);
        
        // Create each knowledge domain sphere
        this.animParams.domains.forEach((domainData, index) => {
            // Create domain group
            const domainGroup = new THREE.Group();
            domainGroup.position.copy(domainData.position);
            this.domainsGroup.add(domainGroup);
            
            // Create outer shell (wireframe)
            const shellGeometry = new THREE.SphereGeometry(domainData.radius, 24, 18);
            const shellMaterial = new THREE.MeshBasicMaterial({
                color: domainData.color,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const shell = new THREE.Mesh(shellGeometry, shellMaterial);
            domainGroup.add(shell);
            
            // Create inner core
            const coreGeometry = new THREE.SphereGeometry(domainData.radius * 0.4, 16, 16);
            const coreMaterial = new THREE.MeshPhongMaterial({
                color: domainData.color,
                emissive: domainData.color,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            const core = new THREE.Mesh(coreGeometry, coreMaterial);
            domainGroup.add(core);
            
            // Create domain particles
            const particlesGroup = new THREE.Group();
            domainGroup.add(particlesGroup);
            
            const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: domainData.color,
                transparent: true,
                opacity: 0.7
            });
            
            const particles = [];
            for (let i = 0; i < domainData.particles; i++) {
                // Random position within the domain sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const r = domainData.radius * (0.5 + 0.4 * Math.random());
                
                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.sin(phi) * Math.sin(theta);
                const z = r * Math.cos(phi);
                
                const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
                particle.position.set(x, y, z);
                particle.scale.set(
                    0.5 + Math.random() * 1.5,
                    0.5 + Math.random() * 1.5,
                    0.5 + Math.random() * 1.5
                );
                particlesGroup.add(particle);
                
                particles.push({
                    mesh: particle,
                    initialPosition: new THREE.Vector3(x, y, z),
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.3 + Math.random() * 0.7
                });
            }
            
            // Store domain data
            this.domains.push({
                group: domainGroup,
                shell: shell,
                core: core,
                particles: particles,
                particlesGroup: particlesGroup,
                color: domainData.color,
                radius: domainData.radius,
                position: domainData.position.clone(),
                rotation: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                }
            });
        });
    }
    
    createDataPoints() {
        // Create data points that move between domains
        this.dataPointsGroup = new THREE.Group();
        this.scene.add(this.dataPointsGroup);
        
        const geometry = new THREE.SphereGeometry(this.animParams.dataPointSize, 8, 8);
        
        for (let i = 0; i < this.animParams.dataPoints; i++) {
            // Choose random source and target domains
            const sourceDomainIndex = Math.floor(Math.random() * this.domains.length);
            let targetDomainIndex = Math.floor(Math.random() * this.domains.length);
            
            // Ensure target is different from source
            while (targetDomainIndex === sourceDomainIndex && this.domains.length > 1) {
                targetDomainIndex = Math.floor(Math.random() * this.domains.length);
            }
            
            const sourceDomain = this.domains[sourceDomainIndex];
            const targetDomain = this.domains[targetDomainIndex];
            
            // Interpolate color between domains
            const color = new THREE.Color().lerpColors(
                new THREE.Color(sourceDomain.color),
                new THREE.Color(targetDomain.color),
                Math.random()
            );
            
            // Create material with glow effect
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.7,
                transparent: true,
                opacity: 0.9
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random starting position within source domain
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = sourceDomain.radius * Math.random();
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            // Set position relative to domain position
            mesh.position.set(
                sourceDomain.position.x + x,
                sourceDomain.position.y + y,
                sourceDomain.position.z + z
            );
            
            this.dataPointsGroup.add(mesh);
            
            // Store data point information
            this.dataPoints.push({
                mesh: mesh,
                sourceDomain: sourceDomainIndex,
                targetDomain: targetDomainIndex,
                progress: 0,  // 0 = at source, 1 = at target
                speed: 0.1 + Math.random() * 0.3,
                color: color,
                // Bezier curve control point (for curved path)
                controlPoint: new THREE.Vector3(
                    (sourceDomain.position.x + targetDomain.position.x) / 2 + (Math.random() - 0.5) * 10,
                    (sourceDomain.position.y + targetDomain.position.y) / 2 + (Math.random() - 0.5) * 10,
                    (sourceDomain.position.z + targetDomain.position.z) / 2 + (Math.random() - 0.5) * 10
                )
            });
        }
    }
    
    createConnectors() {
        // Create connections between domains
        this.connectors = [];
        
        // Create a group for connectors
        this.connectorsGroup = new THREE.Group();
        this.scene.add(this.connectorsGroup);
        
        // Connect each domain to every other domain
        for (let i = 0; i < this.domains.length; i++) {
            for (let j = i + 1; j < this.domains.length; j++) {
                const domain1 = this.domains[i];
                const domain2 = this.domains[j];
                
                // Create curve for connector
                const curvePoints = [];
                const start = domain1.position.clone();
                const end = domain2.position.clone();
                
                // Create a curve with slight upward bend
                const midPoint = new THREE.Vector3().lerpVectors(start, end, 0.5);
                midPoint.y += 2; // Add slight curve upward
                
                // Create curve with 3 points
                const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
                
                // Sample points along curve
                const points = curve.getPoints(20);
                
                // Create tube geometry along curve
                const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
                
                // Create gradient material by lerping colors
                const color = new THREE.Color().lerpColors(
                    new THREE.Color(domain1.color),
                    new THREE.Color(domain2.color),
                    0.5
                );
                
                const material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: 0.3
                });
                
                const tube = new THREE.Mesh(tubeGeometry, material);
                this.connectorsGroup.add(tube);
                
                // Store connector data
                this.connectors.push({
                    mesh: tube,
                    curve: curve,
                    domain1Index: i,
                    domain2Index: j,
                    material: material,
                    color: color
                });
            }
        }
    }
    
    updateDomains(delta, elapsedTime) {
        // Update domain rotations and effects
        this.domains.forEach((domain, index) => {
            // Rotate each domain
            domain.group.rotation.x += domain.rotation.x * this.animParams.rotationSpeed;
            domain.group.rotation.y += domain.rotation.y * this.animParams.rotationSpeed;
            domain.group.rotation.z += domain.rotation.z * this.animParams.rotationSpeed;
            
            // Pulse the core
            const corePulse = Math.sin(elapsedTime * this.animParams.pulseFrequency + index) * 0.2 + 1;
            domain.core.scale.set(corePulse, corePulse, corePulse);
            
            // Update particles
            domain.particles.forEach(particle => {
                const pulse = Math.sin(elapsedTime * particle.pulseSpeed + particle.pulsePhase) * 0.3 + 1;
                particle.mesh.scale.set(pulse, pulse, pulse);
            });
        });
    }
    
    updateDataPoints(delta, elapsedTime) {
        // Update data points movement
        this.dataPoints.forEach(point => {
            // Move along path from source to target
            point.progress += point.speed * delta * this.animParams.dataMigrationSpeed;
            
            // When reaching target, reset with new target
            if (point.progress >= 1) {
                // Current target becomes new source
                const newSource = point.targetDomain;
                
                // Pick new target (different from new source)
                let newTarget = Math.floor(Math.random() * this.domains.length);
                while (newTarget === newSource && this.domains.length > 1) {
                    newTarget = Math.floor(Math.random() * this.domains.length);
                }
                
                // Update data point
                point.sourceDomain = newSource;
                point.targetDomain = newTarget;
                point.progress = 0;
                
                // Update color to blend between domains
                const sourceDomain = this.domains[newSource];
                const targetDomain = this.domains[newTarget];
                
                point.color.lerpColors(
                    new THREE.Color(sourceDomain.color),
                    new THREE.Color(targetDomain.color),
                    0.5
                );
                
                point.mesh.material.color.copy(point.color);
                point.mesh.material.emissive.copy(point.color);
                
                // Update control point for new path
                point.controlPoint.set(
                    (sourceDomain.position.x + targetDomain.position.x) / 2 + (Math.random() - 0.5) * 10,
                    (sourceDomain.position.y + targetDomain.position.y) / 2 + (Math.random() - 0.5) * 10,
                    (sourceDomain.position.z + targetDomain.position.z) / 2 + (Math.random() - 0.5) * 10
                );
            }
            
            // Get source and target positions
            const sourceDomain = this.domains[point.sourceDomain];
            const targetDomain = this.domains[point.targetDomain];
            
            // Quadratic bezier curve movement
            const p0 = sourceDomain.position;
            const p1 = point.controlPoint;
            const p2 = targetDomain.position;
            
            // Calculate position using quadratic bezier curve
            const t = point.progress;
            const newPosition = new THREE.Vector3(
                // Quadratic bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
                Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x,
                Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y,
                Math.pow(1 - t, 2) * p0.z + 2 * (1 - t) * t * p1.z + Math.pow(t, 2) * p2.z
            );
            
            point.mesh.position.copy(newPosition);
            
            // Scale based on progress (smaller at middle of journey)
            const scale = 1 - Math.sin(point.progress * Math.PI) * 0.3;
            point.mesh.scale.set(scale, scale, scale);
            
            // Update opacity based on progress
            point.mesh.material.opacity = 0.5 + Math.sin(point.progress * Math.PI) * 0.5;
        });
        
        // Update connectors
        this.connectors.forEach(connector => {
            // Pulse connector opacity
            const pulseRate = 0.5 + Math.random() * 0.5;
            connector.material.opacity = 0.1 + Math.sin(elapsedTime * pulseRate) * 0.2;
        });
    }
}

export default AIKnowledgeSpheresAnimation; 