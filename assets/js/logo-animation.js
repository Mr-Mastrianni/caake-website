/**
 * CAAKE 3D Logo Animation
 * Using Three.js for 3D rendering and Anime.js for animations
 */

// Prevent duplicate initialization
if (window.CAAKE_LOGO_INITIALIZED) {
    console.warn('CAAKE Logo Animation already initialized. Skipping duplicate initialization.');
} else {
    window.CAAKE_LOGO_INITIALIZED = true;

    // We'll load THREE.js dynamically to avoid import errors

    // Initialize variables
    var scene, camera, renderer, composer;
    var logo, particleSystem;
    var clock;
    var mixer, animationAction;
    var mouseX = 0, mouseY = 0;

// Configuration
const config = {
    colors: {
        background: 0x0a0a12,
        primary: 0x5773ff,
        accent: 0x00f0ff,
        highlight: 0xff007a
    },
    particles: {
        count: 1500,
        size: 0.05,
        radius: 4
    },
    bloom: {
        strength: 1.5,
        radius: 0.75,
        threshold: 0.2
    },
    text: {
        size: 0.8,
        height: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    }
};

// Initialize the scene
function init(containerId) {
    // Make sure THREE is available
    if (!window.THREE) {
        console.error('THREE.js not loaded');
        // Add a fallback message to the container
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #5773ff;">CAAKE</div>';
        }
        return;
    }

    // Initialize clock
    clock = new THREE.Clock();

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Get container dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.colors.background);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Add point lights for extra glow
    const pointLight1 = new THREE.PointLight(config.colors.accent, 1, 10);
    pointLight1.position.set(2, 1, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(config.colors.highlight, 1, 10);
    pointLight2.position.set(-2, -1, 3);
    scene.add(pointLight2);

    // Add bloom effect if available
    if (window.THREE.EffectComposer && window.THREE.RenderPass && window.THREE.UnrealBloomPass) {
        const renderPass = new THREE.RenderPass(scene, camera);
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(width, height),
            config.bloom.strength,
            config.bloom.radius,
            config.bloom.threshold
        );

        composer = new THREE.EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);
    } else {
        console.warn('Post-processing not available. Using standard renderer.');
        // Create a simple render function as fallback
        composer = {
            render: function() {
                renderer.render(scene, camera);
            }
        };
    }

    // Load font and create logo
    loadLogoText();

    // Create particles
    createParticles();

    // Start animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', () => onWindowResize(container));

    // Handle mouse movement for interactive effects
    document.addEventListener('mousemove', onMouseMove);

    // Handle click for interaction
    container.addEventListener('click', onLogoClick);
}

function loadLogoText() {
    // Make sure FontLoader is available
    if (!window.THREE || !window.THREE.FontLoader) {
        console.error('THREE.FontLoader not loaded');
        return;
    }

    const fontLoader = new THREE.FontLoader();

    // Load Helvetiker as fallback, but try to load a more stylish font first
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        createLogoGeometry(font);

        // Try to load a more stylish font
        fontLoader.load('https://threejs.org/examples/fonts/optimer_bold.typeface.json', function(betterFont) {
            // If we successfully loaded the better font, recreate the logo
            scene.remove(logo);
            createLogoGeometry(betterFont);
        });
    });
}

function createLogoGeometry(font) {
    // Make sure TextGeometry is available
    if (!window.THREE || !window.THREE.TextGeometry) {
        console.error('THREE.TextGeometry not loaded');
        return;
    }

    const textOptions = {
        font: font,
        size: config.text.size,
        height: config.text.height,
        curveSegments: 12,
        bevelEnabled: config.text.bevelEnabled,
        bevelThickness: config.text.bevelThickness,
        bevelSize: config.text.bevelSize,
        bevelOffset: 0,
        bevelSegments: config.text.bevelSegments
    };

    const textGeometry = new THREE.TextGeometry('CAAKE', textOptions);
    textGeometry.center();

    // Create materials for the logo
    const mainMaterial = new THREE.MeshStandardMaterial({
        color: config.colors.primary,
        metalness: 0.8,
        roughness: 0.2,
        emissive: config.colors.accent,
        emissiveIntensity: 0.2
    });

    const sideMaterial = new THREE.MeshStandardMaterial({
        color: config.colors.highlight,
        metalness: 0.8,
        roughness: 0.3,
        emissive: config.colors.highlight,
        emissiveIntensity: 0.1
    });

    // Create multi-material for different sides of the text
    const materials = [mainMaterial, sideMaterial];

    logo = new THREE.Mesh(textGeometry, materials);
    scene.add(logo);

    // Set initial scale to zero for animation
    logo.scale.set(0, 0, 0);

    // Start animations
    initLogoAnimations();
}

function createParticles() {
    const particleCount = config.particles.count;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(config.colors.accent);
    const color2 = new THREE.Color(config.colors.highlight);
    const color3 = new THREE.Color(config.colors.primary);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Create particles in a spherical area around the logo
        const radius = config.particles.radius * (0.5 + Math.random() * 0.5);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i+2] = radius * Math.cos(phi);

        // Assign random colors from our palette
        const colorChoice = Math.random();
        let color;

        if (colorChoice < 0.33) {
            color = color1;
        } else if (colorChoice < 0.66) {
            color = color2;
        } else {
            color = color3;
        }

        colors[i] = color.r;
        colors[i+1] = color.g;
        colors[i+2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: config.particles.size,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

function initLogoAnimations() {
    // Initial appearance animation using Anime.js
    anime({
        targets: logo.scale,
        x: [0, 1],
        y: [0, 1],
        z: [0, 1],
        duration: 2000,
        easing: 'easeOutElastic(1, 0.8)',
        complete: startLoopAnimations
    });

    // Initial rotation animation
    anime({
        targets: logo.rotation,
        y: [0, Math.PI * 2],
        duration: 3000,
        easing: 'easeOutExpo'
    });
}

function startLoopAnimations() {
    // Continuous floating animation
    anime({
        targets: logo.position,
        y: [0, 0.2, 0],
        duration: 4000,
        easing: 'easeInOutQuad',
        loop: true
    });

    // Subtle continuous rotation
    anime({
        targets: logo.rotation,
        y: [logo.rotation.y, logo.rotation.y + Math.PI * 2],
        duration: 20000,
        easing: 'linear',
        loop: true
    });

    // Pulsating glow effect by animating emissive intensity
    if (logo.material.length > 0) {
        // For multi-material
        anime({
            targets: logo.material[0],
            emissiveIntensity: [0.2, 0.5, 0.2],
            duration: 3000,
            easing: 'easeInOutSine',
            loop: true
        });
    } else {
        // For single material
        anime({
            targets: logo.material,
            emissiveIntensity: [0.2, 0.5, 0.2],
            duration: 3000,
            easing: 'easeInOutSine',
            loop: true
        });
    }
}

function onLogoClick() {
    // Spin animation on click
    anime({
        targets: logo.rotation,
        y: logo.rotation.y + Math.PI * 2,
        duration: 1500,
        easing: 'easeOutElastic(1, .8)'
    });

    // Scale pulse
    anime({
        targets: logo.scale,
        x: [1, 1.2, 1],
        y: [1, 1.2, 1],
        z: [1, 1.2, 1],
        duration: 1000,
        easing: 'easeInOutQuad'
    });

    // Particle burst
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const direction = new THREE.Vector3(
            positions[i],
            positions[i+1],
            positions[i+2]
        ).normalize();

        // Animate particles outward
        anime({
            targets: {x: positions[i], y: positions[i+1], z: positions[i+2]},
            x: positions[i] + direction.x * 2,
            y: positions[i+1] + direction.y * 2,
            z: positions[i+2] + direction.z * 2,
            duration: 1000,
            easing: 'easeOutQuad',
            update: function(anim) {
                positions[i] = anim.animations[0].currentValue;
                positions[i+1] = anim.animations[1].currentValue;
                positions[i+2] = anim.animations[2].currentValue;
                particleSystem.geometry.attributes.position.needsUpdate = true;
            },
            complete: function() {
                // Return particles to original position
                anime({
                    targets: {x: positions[i], y: positions[i+1], z: positions[i+2]},
                    x: positions[i] - direction.x * 2,
                    y: positions[i+1] - direction.y * 2,
                    z: positions[i+2] - direction.z * 2,
                    duration: 2000,
                    easing: 'easeInOutQuad',
                    update: function(anim) {
                        positions[i] = anim.animations[0].currentValue;
                        positions[i+1] = anim.animations[1].currentValue;
                        positions[i+2] = anim.animations[2].currentValue;
                        particleSystem.geometry.attributes.position.needsUpdate = true;
                    }
                });
            }
        });
    }
}

function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    if (logo) {
        // Subtle tilt based on mouse position with smooth transition
        anime({
            targets: logo.rotation,
            x: mouseY * 0.1,
            z: mouseX * 0.1,
            duration: 800,
            easing: 'easeOutQuad'
        });
    }

    // Make particles slightly follow mouse
    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            // Add subtle movement toward mouse direction
            positions[i] += mouseX * 0.001;
            positions[i+1] += mouseY * 0.001;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Animate particles
    if (particleSystem) {
        particleSystem.rotation.y += 0.0005;

        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            // Add subtle random movement
            positions[i] += 0.002 * (Math.random() - 0.5);
            positions[i+1] += 0.002 * (Math.random() - 0.5);
            positions[i+2] += 0.002 * (Math.random() - 0.5);

            // Keep particles within bounds
            const distance = Math.sqrt(
                positions[i] * positions[i] +
                positions[i+1] * positions[i+1] +
                positions[i+2] * positions[i+2]
            );

            if (distance > config.particles.radius * 1.5) {
                positions[i] *= 0.99;
                positions[i+1] *= 0.99;
                positions[i+2] *= 0.99;
            }
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }

    // Update mixer if animation is loaded
    if (mixer) {
        mixer.update(delta);
    }

    // Render with post-processing
    composer.render();
}

function onWindowResize(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
}

// Load Three.js and its modules dynamically
function loadThreeJS() {
    return new Promise((resolve) => {
        // Load Three.js core
        const threeScript = document.createElement('script');
        threeScript.src = 'assets/js/lib/three/three.min.js';
        threeScript.onload = () => {
            // Once Three.js is loaded, load the required modules
            loadThreeJSModules().then(resolve);
        };
        document.head.appendChild(threeScript);
    });
}

// Load Three.js modules in sequence to ensure dependencies are met
function loadThreeJSModules() {
    return new Promise((resolve) => {
        // Create global THREE object if it doesn't exist
        window.THREE = window.THREE || {};

        // Helper function to load scripts sequentially
        function loadScriptSequentially(scripts, index) {
            if (index >= scripts.length) {
                resolve(); // All scripts loaded
                return;
            }

            const script = document.createElement('script');
            script.src = scripts[index];
            script.onload = function() {
                // Load the next script when this one is done
                loadScriptSequentially(scripts, index + 1);
            };
            script.onerror = function() {
                console.warn('Failed to load script:', scripts[index]);
                // Try to continue with the next script
                loadScriptSequentially(scripts, index + 1);
            };
            document.head.appendChild(script);
        }

        // Define all scripts in the order they need to be loaded
        const scripts = [
            // Core dependencies
            'assets/js/lib/three/FontLoader.js',
            'assets/js/lib/three/TextGeometry.js',

            // Shaders needed for post-processing
            'assets/js/lib/three/CopyShader.js',
            'assets/js/lib/three/LuminosityHighPassShader.js',

            // Post-processing
            'assets/js/lib/three/EffectComposer.js',
            'assets/js/lib/three/ShaderPass.js',
            'assets/js/lib/three/RenderPass.js',
            'assets/js/lib/three/UnrealBloomPass.js'
        ];

        // Start loading scripts sequentially
        loadScriptSequentially(scripts, 0);
    });
}

// Export the initialization function
function initLogoAnimation(containerId) {
    // First load Three.js and its modules
    loadThreeJS().then(() => {
        // Then load Anime.js
        const animeScript = document.createElement('script');
        animeScript.src = 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js';
        animeScript.onload = function() {
            // Initialize once all dependencies are loaded
            init(containerId);
        };
        document.head.appendChild(animeScript);
    });
}

    // Make the function available globally
    window.initLogoAnimation = initLogoAnimation;
} // End of initialization check
