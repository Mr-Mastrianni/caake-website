import ThreeJSSetup from './setup.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

class DataVisualizationAnimation extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for data visualization
        const defaultOptions = {
            backgroundColor: 0x000000,
            transparent: true,
            orbitControls: true,
            postprocessing: true,
            bloom: true,
            bloomStrength: 1.2,
            bloomRadius: 0.6,
            bloomThreshold: 0.4,
            cameraZ: 30,
            cameraY: 0,
            cameraX: 0,
            controlsConfig: {
                enableZoom: true,
                enablePan: false,
                autoRotate: true,
                autoRotateSpeed: 0.5,
                maxDistance: 100,
                minDistance: 10,
                maxPolarAngle: Math.PI - 0.1,
                minPolarAngle: 0.1
            }
        };
        
        super(containerId, {...defaultOptions, ...options});
        
        // Visualization parameters
        this.visualizationState = {
            currentShape: 0,
            targetShape: 0,
            morphProgress: 0,
            scrollPosition: 0,
            autoMorph: options.autoMorph || false,
            autoMorphDuration: options.autoMorphDuration || 10, // seconds between auto-morphs
            lastAutoMorphTime: 0
        };
        
        // Shape generation parameters
        this.shapeParams = {
            particleCount: options.particleCount || 5000,
            particleSize: options.particleSize || 0.15,
            shapeSize: options.shapeSize || 15,
            shapes: [
                'sphere',         // Standard sphere
                'torus',          // Donut/torus shape
                'cube',           // Cube/box
                'helix',          // DNA-like spiral
                'grid',           // 3D grid 
                'wave',           // Sine wave surface
                'spiral',         // Logarithmic spiral
                'hyperboloid',    // Hourglass shape
                'pyramid',        // Pyramid
                'random'          // Random scatter
            ],
            colorSchemes: [
                {
                    name: 'cyber',
                    colors: [0x00fffb, 0xff00f3, 0x00ff73, 0xeaff00]
                },
                {
                    name: 'sunset',
                    colors: [0xff3e00, 0xffbe00, 0xfff700, 0xff00a3]
                },
                {
                    name: 'ocean',
                    colors: [0x00e1ff, 0x0098ff, 0x0049ff, 0x00b3ff]
                },
                {
                    name: 'forest',
                    colors: [0x00ff73, 0x00b627, 0x2d9d16, 0x98ff00]
                }
            ]
        };
        
        // Select a random color scheme
        this.colorScheme = this.shapeParams.colorSchemes[
            Math.floor(Math.random() * this.shapeParams.colorSchemes.length)
        ];
        
        // Initialize shaders and particle system
        this.initializeShaders();
        
        // Create particle system
        this.createParticleSystem();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Set up the animation loop
        this.animate();
    }
    
    initializeShaders() {
        // Set up vertex shader
        this.vertexShader = `
            attribute float size;
            attribute vec3 targetPosition;
            attribute float alpha;
            attribute vec3 color;
            
            varying vec3 vColor;
            varying float vAlpha;
            
            uniform float uMorphProgress;
            
            void main() {
                vColor = color;
                vAlpha = alpha;
                
                // Interpolate between current and target position
                vec3 morphed = mix(position, targetPosition, uMorphProgress);
                
                vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);
                gl_PointSize = size * (1.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        // Set up fragment shader
        this.fragmentShader = `
            varying vec3 vColor;
            varying float vAlpha;
            
            void main() {
                // Calculate distance from center for circular point
                float r = 0.0;
                vec2 cxy = 2.0 * gl_PointCoord - 1.0;
                r = dot(cxy, cxy);
                
                // Soft-edge point rendering
                float alpha = 1.0 - smoothstep(0.8, 1.0, r);
                if (alpha < 0.05) discard;
                
                gl_FragColor = vec4(vColor, vAlpha * alpha);
            }
        `;
    }
    
    createParticleSystem() {
        // Create the particle geometry with all necessary attributes
        this.particleGeometry = new THREE.BufferGeometry();
        
        // Generate positions for each shape
        this.shapePositions = this.generateShapePositions();
        
        // Initialize with the first shape
        const positions = this.shapePositions[0];
        
        // Set the positions attribute
        this.particleGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3)
        );
        
        // Set initial target positions to the same as current positions
        this.particleGeometry.setAttribute(
            'targetPosition',
            new THREE.Float32BufferAttribute(this.shapePositions[1], 3)
        );
        
        // Set particle sizes (vary randomly for more natural look)
        const sizes = new Float32Array(this.shapeParams.particleCount);
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            sizes[i] = this.shapeParams.particleSize * (0.5 + Math.random());
        }
        this.particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Set particle colors (from selected color scheme)
        const colors = new Float32Array(this.shapeParams.particleCount * 3);
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            const colorIndex = Math.floor(Math.random() * this.colorScheme.colors.length);
            const color = new THREE.Color(this.colorScheme.colors[colorIndex]);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Set particle alphas (transparency)
        const alphas = new Float32Array(this.shapeParams.particleCount);
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            alphas[i] = 0.6 + Math.random() * 0.4; // Semi-transparent particles
        }
        this.particleGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        
        // Create shader material
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uMorphProgress: { value: 0.0 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create the particle system
        this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
        this.scene.add(this.particleSystem);
        
        // Optional: Add a subtle ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);
    }
    
    setupEventListeners() {
        // Set up scroll listener to morph shapes based on scroll position
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Set up resize listener to adjust camera aspect ratio
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Setup mouse move for interactive response
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        // Set up update function for animation
        this.update = this.updateVisualization.bind(this);
    }
    
    handleScroll() {
        // Get current scroll position as a value between 0 and 1
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY / scrollHeight;
        
        // Update visualization state
        this.visualizationState.scrollPosition = scrollPosition;
        
        // Map scroll position to shape index
        const shapeCount = this.shapeParams.shapes.length;
        const targetShapeIndex = Math.min(
            shapeCount - 1,
            Math.floor(scrollPosition * shapeCount)
        );
        
        // Trigger morph to new shape if changed
        if (targetShapeIndex !== this.visualizationState.targetShape) {
            this.morphToShape(targetShapeIndex);
        }
    }
    
    handleResize() {
        // Update aspect ratio and renderer size
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    handleMouseMove(event) {
        // Calculate normalized mouse position (-1 to 1)
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Slightly rotate particle system based on mouse position
        if (this.particleSystem) {
            gsap.to(this.particleSystem.rotation, {
                x: y * 0.2,
                y: x * 0.2,
                duration: 1.5,
                ease: "power2.out"
            });
        }
    }
    
    updateVisualization(delta, elapsedTime) {
        // Update morph progress uniform
        if (this.particleMaterial) {
            this.particleMaterial.uniforms.uMorphProgress.value = this.visualizationState.morphProgress;
        }
        
        // Add subtle motion to particle system
        if (this.particleSystem) {
            this.particleSystem.rotation.y += delta * 0.05;
        }
        
        // Auto-morph to next shape if enabled
        if (this.visualizationState.autoMorph) {
            const autoMorphInterval = this.visualizationState.autoMorphDuration;
            
            if (elapsedTime - this.visualizationState.lastAutoMorphTime > autoMorphInterval) {
                this.visualizationState.lastAutoMorphTime = elapsedTime;
                
                // Move to next shape
                const nextShape = (this.visualizationState.currentShape + 1) % this.shapeParams.shapes.length;
                this.morphToShape(nextShape);
            }
        }
    }
    
    morphToShape(shapeIndex) {
        // Save current shape index
        this.visualizationState.currentShape = this.visualizationState.targetShape;
        this.visualizationState.targetShape = shapeIndex;
        
        // Update target positions
        const targetPositions = this.shapePositions[shapeIndex];
        this.particleGeometry.getAttribute('targetPosition').array.set(targetPositions);
        this.particleGeometry.getAttribute('targetPosition').needsUpdate = true;
        
        // Reset morph progress
        this.visualizationState.morphProgress = 0;
        
        // Animate morph progress
        gsap.to(this.visualizationState, {
            morphProgress: 1.0,
            duration: 2.5,
            ease: "power2.inOut",
            onComplete: () => {
                // When animation completes, make the target position the current position
                const positions = this.particleGeometry.getAttribute('position');
                positions.array.set(targetPositions);
                positions.needsUpdate = true;
                
                // Reset morph progress for next animation
                this.visualizationState.morphProgress = 0;
                this.visualizationState.currentShape = shapeIndex;
            }
        });
    }
    
    generateShapePositions() {
        // Generate position arrays for each shape
        const shapePositions = [];
        
        // For each shape, generate particle positions
        this.shapeParams.shapes.forEach(shapeName => {
            const positions = new Float32Array(this.shapeParams.particleCount * 3);
            
            // Generate positions based on shape type
            switch (shapeName) {
                case 'sphere':
                    this.generateSpherePositions(positions);
                    break;
                case 'torus':
                    this.generateTorusPositions(positions);
                    break;
                case 'cube':
                    this.generateCubePositions(positions);
                    break;
                case 'helix':
                    this.generateHelixPositions(positions);
                    break;
                case 'grid':
                    this.generateGridPositions(positions);
                    break;
                case 'wave':
                    this.generateWavePositions(positions);
                    break;
                case 'spiral':
                    this.generateSpiralPositions(positions);
                    break;
                case 'hyperboloid':
                    this.generateHyperboloidPositions(positions);
                    break;
                case 'pyramid':
                    this.generatePyramidPositions(positions);
                    break;
                case 'random':
                    this.generateRandomPositions(positions);
                    break;
                default:
                    this.generateRandomPositions(positions);
            }
            
            shapePositions.push(positions);
        });
        
        return shapePositions;
    }
    
    generateSpherePositions(positions) {
        const radius = this.shapeParams.shapeSize / 2;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Generate random points on a sphere using spherical coordinates
            const theta = Math.random() * Math.PI * 2; // Azimuthal angle (0 to 2π)
            const phi = Math.acos(2 * Math.random() - 1); // Polar angle (0 to π)
            
            // Convert spherical to cartesian coordinates
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
    }
    
    generateTorusPositions(positions) {
        const radius = this.shapeParams.shapeSize / 2;
        const tubeRadius = radius / 3;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Generate random points on a torus
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI * 2;
            
            // Convert torus parameters to cartesian coordinates
            const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
            const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
            const z = tubeRadius * Math.sin(v);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
    }
    
    generateCubePositions(positions) {
        const halfSize = this.shapeParams.shapeSize / 2;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Determine whether to place point on surface or inside
            const onSurface = Math.random() > 0.3; // 70% on surface, 30% inside
            
            if (onSurface) {
                // Choose a random face of the cube (0-5)
                const face = Math.floor(Math.random() * 6);
                
                // Generate random coordinates for that face
                let x, y, z;
                
                switch (face) {
                    case 0: // Front face
                        x = (Math.random() * 2 - 1) * halfSize;
                        y = (Math.random() * 2 - 1) * halfSize;
                        z = halfSize;
                        break;
                    case 1: // Back face
                        x = (Math.random() * 2 - 1) * halfSize;
                        y = (Math.random() * 2 - 1) * halfSize;
                        z = -halfSize;
                        break;
                    case 2: // Top face
                        x = (Math.random() * 2 - 1) * halfSize;
                        y = halfSize;
                        z = (Math.random() * 2 - 1) * halfSize;
                        break;
                    case 3: // Bottom face
                        x = (Math.random() * 2 - 1) * halfSize;
                        y = -halfSize;
                        z = (Math.random() * 2 - 1) * halfSize;
                        break;
                    case 4: // Right face
                        x = halfSize;
                        y = (Math.random() * 2 - 1) * halfSize;
                        z = (Math.random() * 2 - 1) * halfSize;
                        break;
                    case 5: // Left face
                        x = -halfSize;
                        y = (Math.random() * 2 - 1) * halfSize;
                        z = (Math.random() * 2 - 1) * halfSize;
                        break;
                }
                
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
            } else {
                // Generate random point inside cube
                positions[i * 3] = (Math.random() * 2 - 1) * halfSize;
                positions[i * 3 + 1] = (Math.random() * 2 - 1) * halfSize;
                positions[i * 3 + 2] = (Math.random() * 2 - 1) * halfSize;
            }
        }
    }
    
    generateHelixPositions(positions) {
        const radius = this.shapeParams.shapeSize / 3;
        const height = this.shapeParams.shapeSize;
        const turns = 5;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Generate helix parameters - distribute particles evenly along height
            const t = (i / this.shapeParams.particleCount) * turns * Math.PI * 2;
            const h = (i / this.shapeParams.particleCount) * height - height / 2;
            
            // Add some random variance to the radius
            const r = radius * (0.8 + Math.random() * 0.4);
            
            // Convert to cartesian coordinates
            const x = r * Math.cos(t);
            const y = h;
            const z = r * Math.sin(t);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
    }
    
    generateGridPositions(positions) {
        const size = this.shapeParams.shapeSize;
        const cellsPerSide = Math.ceil(Math.pow(this.shapeParams.particleCount, 1/3));
        const spacing = size / cellsPerSide;
        const offset = size / 2 - spacing / 2;
        
        let index = 0;
        for (let i = 0; i < cellsPerSide && index < this.shapeParams.particleCount; i++) {
            for (let j = 0; j < cellsPerSide && index < this.shapeParams.particleCount; j++) {
                for (let k = 0; k < cellsPerSide && index < this.shapeParams.particleCount; k++) {
                    // Add some random displacement for organic feel
                    const jitter = spacing * 0.2;
                    
                    positions[index * 3] = i * spacing - offset + (Math.random() - 0.5) * jitter;
                    positions[index * 3 + 1] = j * spacing - offset + (Math.random() - 0.5) * jitter;
                    positions[index * 3 + 2] = k * spacing - offset + (Math.random() - 0.5) * jitter;
                    
                    index++;
                }
            }
        }
    }
    
    generateWavePositions(positions) {
        const size = this.shapeParams.shapeSize;
        const amplitude = size / 4;
        const frequency = Math.PI * 2 / size;
        
        // Create a grid of points with a sine wave displacement
        const gridSize = Math.ceil(Math.sqrt(this.shapeParams.particleCount));
        const spacing = size / gridSize;
        const offset = size / 2 - spacing / 2;
        
        let index = 0;
        for (let i = 0; i < gridSize && index < this.shapeParams.particleCount; i++) {
            for (let j = 0; j < gridSize && index < this.shapeParams.particleCount; j++) {
                const x = i * spacing - offset;
                const z = j * spacing - offset;
                
                // Calculate y-position using a combination of sine waves
                const y = amplitude * Math.sin(x * frequency) * Math.cos(z * frequency);
                
                positions[index * 3] = x;
                positions[index * 3 + 1] = y;
                positions[index * 3 + 2] = z;
                
                index++;
            }
        }
    }
    
    generateSpiralPositions(positions) {
        const size = this.shapeParams.shapeSize;
        const maxRadius = size / 2;
        const turns = 5;
        const heightRange = size * 0.8;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Logarithmic spiral parameter
            const t = (i / this.shapeParams.particleCount) * turns * Math.PI * 2;
            
            // Growth factor
            const a = maxRadius / (turns * Math.PI * 2);
            
            // Calculate radius using logarithmic spiral formula
            const r = a * t;
            
            // Convert to cartesian coordinates
            const x = r * Math.cos(t);
            const z = r * Math.sin(t);
            
            // Add height variation
            const y = (i / this.shapeParams.particleCount) * heightRange - heightRange / 2;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
    }
    
    generateHyperboloidPositions(positions) {
        const size = this.shapeParams.shapeSize;
        const a = size / 4;
        const b = size / 4;
        const c = size / 4;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Generate random angles
            const theta = Math.random() * Math.PI * 2;
            const v = (Math.random() * 2 - 1) * 2; // -2 to 2
            
            // Generate hyperboloid of one sheet
            // x^2/a^2 + y^2/b^2 - z^2/c^2 = 1
            
            // Calculate hyperboloid coordinates
            const x = a * Math.cosh(v) * Math.cos(theta);
            const y = b * Math.cosh(v) * Math.sin(theta);
            const z = c * Math.sinh(v);
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = z; // Swap y and z for better orientation
            positions[i * 3 + 2] = y;
        }
    }
    
    generatePyramidPositions(positions) {
        const size = this.shapeParams.shapeSize;
        const baseSize = size * 0.8;
        const height = size;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Decide whether to place on face or within pyramid
            const onSurface = Math.random() > 0.3; // 70% on surface, 30% inside
            
            if (onSurface) {
                // Choose a random face (0-4, where 0 is base, 1-4 are triangular faces)
                const face = Math.floor(Math.random() * 5);
                
                if (face === 0) {
                    // Base (square)
                    positions[i * 3] = (Math.random() * 2 - 1) * baseSize / 2;
                    positions[i * 3 + 1] = -height / 2; // Base at bottom
                    positions[i * 3 + 2] = (Math.random() * 2 - 1) * baseSize / 2;
                } else {
                    // Triangular face
                    // Generate a random point on a triangle
                    const u = Math.random();
                    const v = Math.random();
                    
                    if (u + v > 1) {
                        // Ensure the point is within the triangle
                        u = 1 - u;
                        v = 1 - v;
                    }
                    
                    // Apex of the pyramid
                    const apex = [0, height / 2, 0];
                    
                    // Base corners of the pyramid
                    const baseCorners = [
                        [-baseSize / 2, -height / 2, -baseSize / 2],
                        [baseSize / 2, -height / 2, -baseSize / 2],
                        [baseSize / 2, -height / 2, baseSize / 2],
                        [-baseSize / 2, -height / 2, baseSize / 2]
                    ];
                    
                    // Choose two base points for the current face
                    const cornerIndex1 = (face - 1) % 4;
                    const cornerIndex2 = (face) % 4;
                    
                    // Interpolate between apex and the two base points
                    const x = (1 - u - v) * apex[0] + u * baseCorners[cornerIndex1][0] + v * baseCorners[cornerIndex2][0];
                    const y = (1 - u - v) * apex[1] + u * baseCorners[cornerIndex1][1] + v * baseCorners[cornerIndex2][1];
                    const z = (1 - u - v) * apex[2] + u * baseCorners[cornerIndex1][2] + v * baseCorners[cornerIndex2][2];
                    
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;
                }
            } else {
                // Generate a random point inside the pyramid
                // Use a weighted distribution to achieve even density
                const h = Math.random(); // Height factor (0 to 1)
                const baseScale = 1 - h; // Base size scales with height
                
                positions[i * 3] = (Math.random() * 2 - 1) * baseSize / 2 * baseScale;
                positions[i * 3 + 1] = -height / 2 + h * height;
                positions[i * 3 + 2] = (Math.random() * 2 - 1) * baseSize / 2 * baseScale;
            }
        }
    }
    
    generateRandomPositions(positions) {
        const size = this.shapeParams.shapeSize;
        
        for (let i = 0; i < this.shapeParams.particleCount; i++) {
            // Generate random positions within a cube
            positions[i * 3] = (Math.random() * 2 - 1) * size / 2;
            positions[i * 3 + 1] = (Math.random() * 2 - 1) * size / 2;
            positions[i * 3 + 2] = (Math.random() * 2 - 1) * size / 2;
        }
    }
}

export default DataVisualizationAnimation; 