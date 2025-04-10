# Zed-Style 3D Animations for CAAKE Website

This documentation provides a comprehensive guide to implementing the futuristic Zed-Style 3D animations on the CAAKE website.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Basic Implementation](#basic-implementation)
4. [Customization Options](#customization-options)
5. [UI Components](#ui-components)
6. [Performance Considerations](#performance-considerations)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## Introduction

The Zed-Style animations are a set of futuristic 3D animations and UI components inspired by sci-fi interfaces. They use Three.js for 3D rendering and Vanta.js for background effects, creating an immersive experience that can enhance the visual appeal of your AI-focused website.

Key features:
- Wireframe 3D objects (torus, cube, pyramid) with glow effects
- Interactive particle systems
- Holographic UI components
- Scanline and glitch effects
- Responsive design that works on all devices

## Getting Started

### Prerequisites

To use the Zed-Style animations, you need to include the following libraries:

```html
<!-- Three.js (required) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Vanta.js (optional, for background effects) -->
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js"></script>

<!-- Zed-Style CSS -->
<link rel="stylesheet" href="assets/css/zed-style.css">
```

### Files Structure

The Zed-Style animations consist of the following files:

- `assets/js/three-animations/zed-style-animation.js` - The main JavaScript class for 3D animations
- `assets/css/zed-style.css` - CSS styles for UI components and effects

## Basic Implementation

### Adding a 3D Animation

To add a Zed-Style 3D animation to your page:

1. Create a container element with a unique ID and the `data-animation="zed-style"` attribute:

```html
<div data-animation="zed-style" id="my-animation-container" style="height: 400px;"></div>
```

2. The animation will be automatically initialized when the page loads, using the Three.js animation system.

### Manual Initialization

If you need more control over the animation, you can manually initialize it:

```javascript
import ZedStyleAnimation from './assets/js/three-animations/zed-style-animation.js';

document.addEventListener('DOMContentLoaded', () => {
    const animation = new ZedStyleAnimation('my-animation-container', {
        backgroundColor: 0x0a0a12,
        wireframeColor: 0x5773ff,
        glowColor: 0x00f0ff,
        accentColor: 0xff007a,
        bloomStrength: 1.5,
        rotationSpeed: 0.005,
        vantaEffect: 'globe'
    });
});
```

## Customization Options

The `ZedStyleAnimation` class accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backgroundColor` | Number (hex) | `0x0a0a12` | Background color of the scene |
| `wireframeColor` | Number (hex) | `0x5773ff` | Primary color for wireframe objects |
| `glowColor` | Number (hex) | `0x00f0ff` | Color for glow effects |
| `accentColor` | Number (hex) | `0xff007a` | Secondary accent color |
| `bloomStrength` | Number | `1.5` | Strength of the glow effect (0-3) |
| `bloomRadius` | Number | `0.75` | Radius of the glow effect |
| `bloomThreshold` | Number | `0.2` | Threshold for the glow effect |
| `rotationSpeed` | Number | `0.005` | Speed of object rotation |
| `interactive` | Boolean | `true` | Whether objects respond to mouse movement |
| `mouseFollowIntensity` | Number | `0.1` | Intensity of mouse follow effect |
| `enableOrbitControls` | Boolean | `false` | Enable orbit controls for camera |
| `enableVanta` | Boolean | `true` | Enable Vanta.js background effect |
| `vantaEffect` | String | `'globe'` | Type of Vanta effect ('globe', 'net', 'waves', 'dots') |
| `objectsToRender` | Array | `['torus', 'cube', 'pyramid', 'particles']` | Which objects to include in the scene |

## UI Components

The Zed-Style CSS includes several UI components that complement the 3D animations:

### Holographic Cards

```html
<div class="holographic-card">
    <h3 class="neon-text">Card Title</h3>
    <p>Card content goes here.</p>
    <a href="#" class="zed-button">Action</a>
</div>
```

### Glitch Text Effect

```html
<h1 class="glitch-text" data-text="Glitch Text">Glitch Text</h1>
```

### Neon Text

```html
<h2 class="neon-text">Glowing Text</h2>
```

### Zed-Style Buttons

```html
<a href="#" class="zed-button">Click Me</a>
```

### Scanline Effect

```html
<div class="scanline">
    <!-- Content with scanline effect -->
</div>
```

### Grid Background

```html
<section class="grid-background">
    <!-- Content with grid background -->
</section>
```

## Performance Considerations

The 3D animations can be resource-intensive, especially on lower-end devices. Here are some tips to optimize performance:

1. Use the `objectsToRender` option to limit the number of objects in the scene
2. Reduce `bloomStrength` and `bloomRadius` for better performance
3. Set `enableVanta: false` if you don't need the background effect
4. Use the IntersectionObserver to pause animations when they're not visible

Example of performance optimization:

```javascript
const animation = new ZedStyleAnimation('my-animation-container', {
    objectsToRender: ['particles'], // Only render particles
    bloomStrength: 0.8, // Reduce bloom strength
    bloomRadius: 0.4, // Reduce bloom radius
    enableVanta: false // Disable Vanta background
});
```

## Examples

### Hero Section Animation

```html
<div class="hero scanline" style="height: 80vh; position: relative;">
    <div data-animation="zed-style" id="hero-animation" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>
    
    <div class="hero-content" style="position: relative; z-index: 1; text-align: center; padding: 4rem 2rem;">
        <h1 class="zed-heading glitch-text" data-text="CAAKE">CAAKE</h1>
        <h2 class="neon-text">AI-Powered Enterprise Automation</h2>
        <p>Transform your business operations with intelligent AI solutions.</p>
        <a href="#" class="zed-button">Get Started</a>
    </div>
</div>
```

### Services Section with Holographic Cards

```html
<section class="services grid-background">
    <div class="container">
        <h2 class="zed-heading">Our Services</h2>
        
        <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
            <div class="holographic-card">
                <h3 class="neon-text">AI Consulting</h3>
                <p>Expert advice on AI strategy and implementation.</p>
                <a href="#" class="zed-button">Learn More</a>
            </div>
            
            <div class="holographic-card">
                <h3 class="neon-text">Automations</h3>
                <p>Streamline workflows with intelligent automation.</p>
                <a href="#" class="zed-button">Learn More</a>
            </div>
            
            <div class="holographic-card">
                <h3 class="neon-text">AI Solutions</h3>
                <p>Custom AI solutions for your business challenges.</p>
                <a href="#" class="zed-button">Learn More</a>
            </div>
        </div>
    </div>
</section>
```

## Troubleshooting

### Common Issues

1. **Animation not appearing**
   - Check if Three.js is properly loaded
   - Ensure the container has a height set
   - Check browser console for errors

2. **Performance issues**
   - Reduce the number of objects with `objectsToRender`
   - Disable Vanta.js background with `enableVanta: false`
   - Lower bloom settings

3. **Vanta.js background not working**
   - Ensure all Vanta.js scripts are loaded
   - Check if the container has a position set (relative, absolute, etc.)

4. **CSS effects not working**
   - Make sure `zed-style.css` is properly included
   - Check for CSS conflicts with other stylesheets

### Browser Compatibility

The Zed-Style animations work best in modern browsers that support WebGL:
- Chrome 9+
- Firefox 4+
- Safari 5.1+
- Edge 12+
- Opera 12+

For older browsers, the animations will gracefully degrade to show static content.
