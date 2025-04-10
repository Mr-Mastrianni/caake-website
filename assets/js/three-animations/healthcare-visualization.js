// import * as THREE from 'three'; // Remove this line
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

class HealthcareVisualization extends ThreeJSSetup {
    constructor(containerId, options = {}) {
        // Set default options for healthcare visualization
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
            cameraY: 0,
            cameraX: 0,
            controlsConfig: {
                enableZoom: false,
                enablePan: false,
                autoRotate: true,
                autoRotateSpeed: 0.5,
                maxDistance: 100,
                minDistance: 10
            }
        };

        // Merge default options with provided options
        const mergedOptions = { ...defaultOptions, ...options };
        super(containerId, mergedOptions);

        // DNA helix parameters
        this.dnaParams = {
            strands: 2,
            basePairs: 20,
            radius: 5,
            height: 30,
            twistRate: 0.4,
            baseDistance: 1.2,
            colors: {
                strand1: 0x3498db, // Blue
                strand2: 0xe74c3c, // Red
                basePair: 0xf1c40f, // Yellow
                pulse: 0x2ecc71  // Green
            }
        };

        // Heartbeat parameters
        this.heartbeatParams = {
            points: 100,
            width: 15,
            height: 3,
            color: 0xff5555,
            pulseSpeed: 1.5,
            lineWidth: 2
        };

        // Medical data parameters
        this.dataParams = {
            count: 100,
            size: 0.15,
            speed: 0.5,
            color: 0x66ccff
        };

        // Initialize the visualization
        this.init();
    }

    init() {
        // Create DNA helix
        this.createDNAHelix();

        // Create heartbeat line
        this.createHeartbeat();

        // Create floating data particles
        this.createDataParticles();

        // Setup animations
        this.setupAnimations();

        // Start animation loop
        this.renderer.setAnimationLoop(this.animate.bind(this));
    }

    createDNAHelix() {
        // Create DNA group
        this.dnaGroup = new THREE.Group();
        this.scene.add(this.dnaGroup);

        // Position DNA group
        this.dnaGroup.position.set(-10, 0, 0);
        this.dnaGroup.rotation.set(Math.PI / 6, 0, Math.PI / 6);

        // Create strands
        this.dnaStrands = [];
        this.basePairs = [];

        // Create material for strands
        const strand1Material = new THREE.MeshPhongMaterial({
            color: this.dnaParams.colors.strand1,
            emissive: this.dnaParams.colors.strand1,
            emissiveIntensity: 0.3,
            shininess: 100
        });

        const strand2Material = new THREE.MeshPhongMaterial({
            color: this.dnaParams.colors.strand2,
            emissive: this.dnaParams.colors.strand2,
            emissiveIntensity: 0.3,
            shininess: 100
        });

        // Create geometry for strand nodes
        const nodeGeometry = new THREE.SphereGeometry(0.4, 16, 16);

        // Create base pair material
        const basePairMaterial = new THREE.MeshPhongMaterial({
            color: this.dnaParams.colors.basePair,
            emissive: this.dnaParams.colors.basePair,
            emissiveIntensity: 0.2,
            shininess: 100
        });

        // Create base pair geometry
        const basePairGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
        basePairGeometry.rotateZ(Math.PI / 2);

        // Create DNA structure
        for (let i = 0; i < this.dnaParams.basePairs; i++) {
            const height = i * this.dnaParams.baseDistance - this.dnaParams.height / 2;
            const angle1 = i * this.dnaParams.twistRate;
            const angle2 = angle1 + Math.PI;

            // Calculate positions
            const x1 = Math.cos(angle1) * this.dnaParams.radius;
            const z1 = Math.sin(angle1) * this.dnaParams.radius;

            const x2 = Math.cos(angle2) * this.dnaParams.radius;
            const z2 = Math.sin(angle2) * this.dnaParams.radius;

            // Create strand nodes
            const node1 = new THREE.Mesh(nodeGeometry, strand1Material);
            node1.position.set(x1, height, z1);
            this.dnaGroup.add(node1);

            const node2 = new THREE.Mesh(nodeGeometry, strand2Material);
            node2.position.set(x2, height, z2);
            this.dnaGroup.add(node2);

            this.dnaStrands.push(node1, node2);

            // Create base pair connecting the strands
            const basePair = new THREE.Mesh(basePairGeometry, basePairMaterial);
            basePair.position.set((x1 + x2) / 2, height, (z1 + z2) / 2);
            basePair.lookAt(x2, height, z2);
            basePair.scale.x = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
            this.dnaGroup.add(basePair);

            this.basePairs.push(basePair);

            // Connect to previous nodes in the same strand
            if (i > 0) {
                // Connect strand 1
                const connector1Geo = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
                const connector1 = new THREE.Mesh(connector1Geo, strand1Material);

                const prev1 = this.dnaStrands[(i - 1) * 2];
                connector1.position.set(
                    (prev1.position.x + node1.position.x) / 2,
                    (prev1.position.y + node1.position.y) / 2,
                    (prev1.position.z + node1.position.z) / 2
                );

                // Orient the cylinder to connect the nodes
                connector1.lookAt(prev1.position);
                connector1.scale.y = prev1.position.distanceTo(node1.position);
                this.dnaGroup.add(connector1);

                // Connect strand 2
                const connector2Geo = new THREE.CylinderGeometry(0.15, 0.15, 1, 8);
                const connector2 = new THREE.Mesh(connector2Geo, strand2Material);

                const prev2 = this.dnaStrands[(i - 1) * 2 + 1];
                connector2.position.set(
                    (prev2.position.x + node2.position.x) / 2,
                    (prev2.position.y + node2.position.y) / 2,
                    (prev2.position.z + node2.position.z) / 2
                );

                // Orient the cylinder to connect the nodes
                connector2.lookAt(prev2.position);
                connector2.scale.y = prev2.position.distanceTo(node2.position);
                this.dnaGroup.add(connector2);
            }
        }
    }

    createHeartbeat() {
        // Create heartbeat group
        this.heartbeatGroup = new THREE.Group();
        this.scene.add(this.heartbeatGroup);

        // Position heartbeat
        this.heartbeatGroup.position.set(10, -5, 0);
        this.heartbeatGroup.rotation.set(0, -Math.PI / 4, 0);

        // Create heartbeat line
        const points = [];
        this.heartbeatPoints = [];

        // Generate initial flat line
        for (let i = 0; i < this.heartbeatParams.points; i++) {
            const x = (i / (this.heartbeatParams.points - 1) - 0.5) * this.heartbeatParams.width;
            const y = 0;
            const z = 0;

            points.push(new THREE.Vector3(x, y, z));
            this.heartbeatPoints.push({ x, y, z, originalY: y });
        }

        // Create line geometry
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create line material
        const lineMaterial = new THREE.LineBasicMaterial({
            color: this.heartbeatParams.color,
            linewidth: this.heartbeatParams.lineWidth
        });

        // Create line
        this.heartbeatLine = new THREE.Line(lineGeometry, lineMaterial);
        this.heartbeatGroup.add(this.heartbeatLine);

        // Add glow effect
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(this.heartbeatParams.color) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                varying vec2 vUv;
                void main() {
                    float intensity = 0.7 - distance(vUv, vec2(0.5));
                    gl_FragColor = vec4(color, intensity * 0.5);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        // Create a plane behind the line for the glow
        const glowGeometry = new THREE.PlaneGeometry(
            this.heartbeatParams.width + 2,
            this.heartbeatParams.height + 2
        );

        this.heartbeatGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.heartbeatGlow.position.z = -0.1;
        this.heartbeatGroup.add(this.heartbeatGlow);
    }

    createDataParticles() {
        // Create data particles group
        this.dataGroup = new THREE.Group();
        this.scene.add(this.dataGroup);

        // Position data group
        this.dataGroup.position.set(0, 10, 0);

        // Create particle geometry
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.dataParams.count * 3);
        const colors = new Float32Array(this.dataParams.count * 3);
        const sizes = new Float32Array(this.dataParams.count);

        const color = new THREE.Color(this.dataParams.color);

        // Generate random positions within a sphere
        for (let i = 0; i < this.dataParams.count; i++) {
            const i3 = i * 3;

            // Position
            const radius = 5 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = radius * Math.cos(phi);

            // Color with slight variation
            colors[i3] = color.r * (0.8 + Math.random() * 0.4);
            colors[i3 + 1] = color.g * (0.8 + Math.random() * 0.4);
            colors[i3 + 2] = color.b * (0.8 + Math.random() * 0.4);

            // Size with variation
            sizes[i] = this.dataParams.size * (0.5 + Math.random());
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Create particle material
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;

                void main() {
                    vColor = color;

                    // Add subtle movement
                    vec3 pos = position;
                    pos.x += sin(time * 0.5 + position.z * 0.5) * 0.2;
                    pos.y += cos(time * 0.4 + position.x * 0.5) * 0.2;
                    pos.z += sin(time * 0.3 + position.y * 0.5) * 0.2;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;

                void main() {
                    // Create circular point
                    float r = distance(gl_PointCoord, vec2(0.5));
                    if (r > 0.5) discard;

                    // Add glow effect
                    float intensity = 1.0 - r * 2.0;
                    gl_FragColor = vec4(vColor, intensity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });

        // Create particle system
        this.dataParticles = new THREE.Points(particleGeometry, particleMaterial);
        this.dataGroup.add(this.dataParticles);
    }

    setupAnimations() {
        // Setup the update function
        this.update = (delta, elapsedTime) => {
            // Update DNA animation
            this.updateDNA(delta, elapsedTime);

            // Update heartbeat animation
            this.updateHeartbeat(delta, elapsedTime);

            // Update data particles
            this.updateDataParticles(delta, elapsedTime);
        };
    }

    updateDNA(delta, elapsedTime) {
        // Rotate DNA
        this.dnaGroup.rotation.y += delta * 0.2;

        // Pulse effect on random base pairs
        if (Math.random() < 0.02) {
            const randomIndex = Math.floor(Math.random() * this.basePairs.length);
            const basePair = this.basePairs[randomIndex];

            // Pulse animation
            gsap.to(basePair.material, {
                emissiveIntensity: 0.8,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    basePair.material.emissiveIntensity = 0.2;
                }
            });
        }
    }

    updateHeartbeat(delta, elapsedTime) {
        // Calculate heartbeat wave
        const pulseTime = elapsedTime * this.heartbeatParams.pulseSpeed;
        const pulseCycle = pulseTime % 2; // 2-second cycle

        // Update points based on heartbeat pattern
        for (let i = 0; i < this.heartbeatPoints.length; i++) {
            const point = this.heartbeatPoints[i];
            const normalizedX = (point.x / this.heartbeatParams.width) + 0.5; // 0 to 1

            // Default flat line
            let y = 0;

            // Create heartbeat pattern
            if (pulseCycle < 1) { // Active heartbeat in first half of cycle
                const beatPosition = 0.3; // Position of the heartbeat peak
                const beatWidth = 0.1; // Width of the heartbeat

                // Distance from the beat center
                const distFromBeat = Math.abs(normalizedX - beatPosition);

                if (distFromBeat < beatWidth) {
                    // First upward spike
                    y = Math.sin((1 - distFromBeat / beatWidth) * Math.PI) * 2;
                }

                // Second spike (larger)
                const distFromBeat2 = Math.abs(normalizedX - (beatPosition + beatWidth * 2));
                if (distFromBeat2 < beatWidth * 1.5) {
                    y = Math.sin((1 - distFromBeat2 / (beatWidth * 1.5)) * Math.PI) * 3;
                }

                // Small final bump
                const distFromBeat3 = Math.abs(normalizedX - (beatPosition + beatWidth * 5));
                if (distFromBeat3 < beatWidth * 2) {
                    y = Math.sin((1 - distFromBeat3 / (beatWidth * 2)) * Math.PI) * 0.8;
                }
            }

            // Update point position
            point.y = y;

            // Update line geometry
            this.heartbeatLine.geometry.attributes.position.array[i * 3 + 1] = y;
        }

        // Update line geometry
        this.heartbeatLine.geometry.attributes.position.needsUpdate = true;

        // Update glow intensity based on heartbeat
        if (pulseCycle < 0.2) {
            this.heartbeatGlow.material.opacity = 0.7;
        } else {
            this.heartbeatGlow.material.opacity = 0.2;
        }
    }

    updateDataParticles(delta, elapsedTime) {
        // Rotate data group
        this.dataGroup.rotation.y += delta * 0.1;

        // Update time uniform for shader animation
        if (this.dataParticles && this.dataParticles.material.uniforms) {
            this.dataParticles.material.uniforms.time.value = elapsedTime;
        }
    }
}

export default HealthcareVisualization;
