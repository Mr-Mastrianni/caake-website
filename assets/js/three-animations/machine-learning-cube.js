import ThreeJSSetup from './setup.js';
import * as THREE from 'three';

class MachineLearningCubeAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for machine learning cube animation
        const defaultOptions = {
            backgroundColor: 0x000000,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 1.0,
            bloomRadius: 0.5,
            bloomThreshold: 0.2,
            cameraZ: 120,
            controlsConfig: {
                autoRotate: true,
                autoRotateSpeed: 0.5,
                enableZoom: true,
                maxDistance: 200,
                minDistance: 50
            }
        };
        
        super(containerId, {...defaultOptions, ...options});
        
        // Cube parameters
        this.cubeSize = options.cubeSize || 40;
        this.gridSize = options.gridSize || 10;
        this.dataPointCount = options.dataPointCount || 100;
        this.learningSpeed = options.learningSpeed || 0.5;
        this.cubeColor = options.cubeColor || 0x4d9fff;
        this.dataPointColors = options.dataPointColors || [
            new THREE.Color(0xff4d9f), // Pink
            new THREE.Color(0x9d6eff), // Purple
            new THREE.Color(0x4dff9f)  // Green
        ];
        
        // Learning state
        this.learningPhase = 0;
        this.targetShape = 'sphere';
        this.morphProgress = 0;
        this.dataPoints = [];
        this.targetPoints = [];
        
        // Initialize the cube
        this.initializeCube();
        
        // Start the animation loop
        this.animate();
    }
    
    initializeCube() {
        // Create groups
        this.cubeGroup = new THREE.Group();
        this.dataPointsGroup = new THREE.Group();
        this.scene.add(this.cubeGroup);
        this.scene.add(this.dataPointsGroup);
        
        // Create cube wireframe
        this.createCubeWireframe();
        
        // Create data points
        this.createDataPoints();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);
        
        // Add point light in the center
        const pointLight = new THREE.PointLight(0x4d9fff, 1, 200);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);
        
        // Setup the update function
        this.update = (delta, elapsedTime) => {
            // Update the learning process
            this.updateLearning(delta, elapsedTime);
            
            // Update data points
            this.updateDataPoints(delta, elapsedTime);
        };
    }
    
    createCubeWireframe() {
        // Create a cube wireframe
        const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
        const edges = new THREE.EdgesGeometry(geometry);
        const material = new THREE.LineBasicMaterial({
            color: this.cubeColor,
            transparent: true,
            opacity: 0.6
        });
        
        this.cubeWireframe = new THREE.LineSegments(edges, material);
        this.cubeGroup.add(this.cubeWireframe);
        
        // Create grid lines inside the cube
        this.createGridLines();
    }
    
    createGridLines() {
        // Create grid lines inside the cube
        const gridStep = this.cubeSize / this.gridSize;
        const gridOffset = this.cubeSize / 2;
        
        // Create grid material
        const material = new THREE.LineBasicMaterial({
            color: this.cubeColor,
            transparent: true,
            opacity: 0.2
        });
        
        // Create grid lines
        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * gridStep - gridOffset;
            
            // X-axis lines
            for (let j = 0; j <= this.gridSize; j++) {
                const lineGeometry = new THREE.BufferGeometry();
                const linePositions = new Float32Array(6);
                
                linePositions[0] = -gridOffset;
                linePositions[1] = pos;
                linePositions[2] = j * gridStep - gridOffset;
                
                linePositions[3] = gridOffset;
                linePositions[4] = pos;
                linePositions[5] = j * gridStep - gridOffset;
                
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
                const line = new THREE.Line(lineGeometry, material);
                this.cubeGroup.add(line);
            }
            
            // Y-axis lines
            for (let j = 0; j <= this.gridSize; j++) {
                const lineGeometry = new THREE.BufferGeometry();
                const linePositions = new Float32Array(6);
                
                linePositions[0] = pos;
                linePositions[1] = -gridOffset;
                linePositions[2] = j * gridStep - gridOffset;
                
                linePositions[3] = pos;
                linePositions[4] = gridOffset;
                linePositions[5] = j * gridStep - gridOffset;
                
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
                const line = new THREE.Line(lineGeometry, material);
                this.cubeGroup.add(line);
            }
            
            // Z-axis lines
            for (let j = 0; j <= this.gridSize; j++) {
                const lineGeometry = new THREE.BufferGeometry();
                const linePositions = new Float32Array(6);
                
                linePositions[0] = pos;
                linePositions[1] = j * gridStep - gridOffset;
                linePositions[2] = -gridOffset;
                
                linePositions[3] = pos;
                linePositions[4] = j * gridStep - gridOffset;
                linePositions[5] = gridOffset;
                
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
                const line = new THREE.Line(lineGeometry, material);
                this.cubeGroup.add(line);
            }
        }
    }
    
    createDataPoints() {
        // Create data points
        for (let i = 0; i < this.dataPointCount; i++) {
            // Random position within the cube
            const position = new THREE.Vector3(
                (Math.random() - 0.5) * this.cubeSize,
                (Math.random() - 0.5) * this.cubeSize,
                (Math.random() - 0.5) * this.cubeSize
            );
            
            // Create geometry
            const geometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.5, 8, 8);
            
            // Random color from our palette
            const color = this.dataPointColors[Math.floor(Math.random() * this.dataPointColors.length)];
            
            // Create material
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7
            });
            
            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            this.dataPointsGroup.add(mesh);
            
            // Store data point
            this.dataPoints.push({
                mesh: mesh,
                originalPosition: position.clone(),
                targetPosition: null,
                speed: 0.5 + Math.random() * 0.5,
                phase: Math.random() * Math.PI * 2,
                category: Math.floor(Math.random() * 3) // Random category for classification
            });
        }
        
        // Generate target positions for different shapes
        this.generateTargetPositions();
    }
    
    generateTargetPositions() {
        // Generate target positions for different shapes
        this.targetPositions = {
            sphere: [],
            torus: [],
            spiral: []
        };
        
        // Generate sphere positions
        for (let i = 0; i < this.dataPoints.length; i++) {
            const phi = Math.acos(-1 + (2 * i) / this.dataPoints.length);
            const theta = Math.sqrt(this.dataPoints.length * Math.PI) * phi;
            
            const x = Math.cos(theta) * Math.sin(phi) * this.cubeSize * 0.4;
            const y = Math.sin(theta) * Math.sin(phi) * this.cubeSize * 0.4;
            const z = Math.cos(phi) * this.cubeSize * 0.4;
            
            this.targetPositions.sphere.push(new THREE.Vector3(x, y, z));
        }
        
        // Generate torus positions
        const torusRadius = this.cubeSize * 0.3;
        const tubeRadius = this.cubeSize * 0.1;
        
        for (let i = 0; i < this.dataPoints.length; i++) {
            const u = (i / this.dataPoints.length) * Math.PI * 2;
            const v = (i % 20) / 20 * Math.PI * 2;
            
            const x = (torusRadius + tubeRadius * Math.cos(v)) * Math.cos(u);
            const y = (torusRadius + tubeRadius * Math.cos(v)) * Math.sin(u);
            const z = tubeRadius * Math.sin(v);
            
            this.targetPositions.torus.push(new THREE.Vector3(x, y, z));
        }
        
        // Generate spiral positions
        const spiralRadius = this.cubeSize * 0.3;
        const spiralHeight = this.cubeSize * 0.8;
        
        for (let i = 0; i < this.dataPoints.length; i++) {
            const t = (i / this.dataPoints.length) * Math.PI * 6;
            const h = (i / this.dataPoints.length) * spiralHeight - spiralHeight / 2;
            
            const x = spiralRadius * Math.cos(t) * (1 - Math.abs(h) / (spiralHeight / 2) * 0.5);
            const y = h;
            const z = spiralRadius * Math.sin(t) * (1 - Math.abs(h) / (spiralHeight / 2) * 0.5);
            
            this.targetPositions.spiral.push(new THREE.Vector3(x, y, z));
        }
    }
    
    updateLearning(delta, elapsedTime) {
        // Update learning phase
        this.learningPhase += delta * this.learningSpeed;
        
        // Change target shape every 10 seconds
        const shapeCycleTime = 10;
        const shapeCycle = Math.floor(elapsedTime / shapeCycleTime) % 3;
        
        if (shapeCycle === 0 && this.targetShape !== 'sphere') {
            this.targetShape = 'sphere';
            this.morphProgress = 0;
        } else if (shapeCycle === 1 && this.targetShape !== 'torus') {
            this.targetShape = 'torus';
            this.morphProgress = 0;
        } else if (shapeCycle === 2 && this.targetShape !== 'spiral') {
            this.targetShape = 'spiral';
            this.morphProgress = 0;
        }
        
        // Update morph progress
        if (this.morphProgress < 1) {
            this.morphProgress += delta * 0.5; // Slow transition
            if (this.morphProgress > 1) this.morphProgress = 1;
        }
        
        // Update cube rotation based on learning phase
        this.cubeGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
        this.cubeGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.1;
        this.cubeGroup.rotation.z = Math.sin(elapsedTime * 0.4) * 0.1;
    }
    
    updateDataPoints(delta, elapsedTime) {
        // Update data points
        for (let i = 0; i < this.dataPoints.length; i++) {
            const dataPoint = this.dataPoints[i];
            const targetPosition = this.targetPositions[this.targetShape][i];
            
            // Calculate new position
            const newPosition = new THREE.Vector3();
            
            // Interpolate between original and target position
            newPosition.lerpVectors(
                dataPoint.originalPosition,
                targetPosition,
                this.morphProgress
            );
            
            // Add some noise/jitter
            const jitter = 0.5;
            newPosition.x += Math.sin(elapsedTime * dataPoint.speed + dataPoint.phase) * jitter;
            newPosition.y += Math.cos(elapsedTime * dataPoint.speed + dataPoint.phase * 2) * jitter;
            newPosition.z += Math.sin(elapsedTime * dataPoint.speed + dataPoint.phase * 3) * jitter;
            
            // Update mesh position
            dataPoint.mesh.position.copy(newPosition);
            
            // Pulse size based on phase
            const scale = 1 + 0.2 * Math.sin(elapsedTime * 2 + dataPoint.phase);
            dataPoint.mesh.scale.set(scale, scale, scale);
            
            // Update color based on category and learning phase
            if (this.morphProgress > 0.5) {
                // Gradually change color based on category
                const targetColor = this.dataPointColors[dataPoint.category];
                dataPoint.mesh.material.color.lerp(targetColor, delta * 2);
            }
        }
    }
}

export default MachineLearningCubeAnimation;
