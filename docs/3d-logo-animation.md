# 3D Logo Animation Documentation

This documentation provides a comprehensive guide to using the 3D animated CAAKE logo on your website.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Basic Implementation](#basic-implementation)
4. [Customization Options](#customization-options)
5. [Performance Considerations](#performance-considerations)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

## Introduction

The 3D Logo Animation is a dynamic, interactive representation of the CAAKE logo using Three.js for 3D rendering and Anime.js for smooth animations. It features:

- Extruded 3D text with beveled edges
- Glowing effect with bloom post-processing
- Particle system surrounding the logo
- Interactive elements that respond to mouse movement
- Click interactions with animation effects
- Responsive design that works on all devices

## Getting Started

### Prerequisites

To use the 3D Logo Animation, you need to include the following libraries:

```html
<!-- Three.js (required) -->
<script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js" type="module"></script>

<!-- Anime.js (required) -->
<script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>

<!-- Logo Animation CSS -->
<link rel="stylesheet" href="assets/css/logo-animation.css">
```

### Files Structure

The 3D Logo Animation consists of the following files:

- `assets/js/logo-animation.js` - The main JavaScript module for the 3D logo animation
- `assets/js/include-logo-animation.js` - Helper script to easily include the logo animation on any page
- `assets/css/logo-animation.css` - CSS styles for the logo containers

## Basic Implementation

### Method 1: Automatic Implementation

The simplest way to add the 3D logo animation to your website is to include the helper script:

```html
<script type="module" src="assets/js/include-logo-animation.js"></script>
```

This script will automatically:
1. Replace the logo in your navbar with the 3D animated version
2. Add a 3D logo to your hero section if one exists
3. Optionally add a background 3D logo (disabled by default)

You can control which logos are initialized by adding URL parameters:

```
?navbar-logo=false&hero-logo=true&background-logo=true
```

### Method 2: Manual Implementation

For more control, you can manually add the logo animation to specific containers:

1. Create a container element with a unique ID:

```html
<div id="my-logo-container" class="logo-3d-container" style="height: 300px;"></div>
```

2. Initialize the logo animation in your JavaScript:

```javascript
import initLogoAnimation from './assets/js/logo-animation.js';

document.addEventListener('DOMContentLoaded', () => {
    initLogoAnimation('my-logo-container');
});
```

## Customization Options

The logo animation can be customized by modifying the `config` object in `logo-animation.js`:

```javascript
const config = {
    colors: {
        background: 0x0a0a12,  // Background color
        primary: 0x5773ff,     // Primary logo color
        accent: 0x00f0ff,      // Accent color for glow
        highlight: 0xff007a     // Highlight color for edges
    },
    particles: {
        count: 1500,           // Number of particles
        size: 0.05,            // Particle size
        radius: 4              // Radius of particle system
    },
    bloom: {
        strength: 1.5,         // Bloom effect strength
        radius: 0.75,          // Bloom effect radius
        threshold: 0.2         // Bloom effect threshold
    },
    text: {
        size: 0.8,             // Text size
        height: 0.2,           // Text extrusion height
        bevelEnabled: true,    // Enable beveled edges
        bevelThickness: 0.03,  // Bevel thickness
        bevelSize: 0.02,       // Bevel size
        bevelSegments: 5       // Bevel segments
    }
};
```

## Performance Considerations

The 3D logo animation uses WebGL and can be resource-intensive on lower-end devices. Here are some tips to optimize performance:

1. Reduce the number of particles by setting `config.particles.count` to a lower value
2. Disable the bloom effect for better performance on mobile devices
3. Use the logo animation only where it provides the most impact (e.g., hero section)
4. Consider disabling the animation on mobile devices or providing a simpler fallback

## Examples

### Navbar Logo

```html
<div id="navbar-logo" class="logo-3d-container logo-navbar"></div>

<script type="module">
    import initLogoAnimation from './assets/js/logo-animation.js';
    initLogoAnimation('navbar-logo');
</script>
```

### Hero Section Logo

```html
<div id="hero-logo" class="logo-3d-container logo-hero"></div>

<script type="module">
    import initLogoAnimation from './assets/js/logo-animation.js';
    initLogoAnimation('hero-logo');
</script>
```

### Background Logo

```html
<div id="background-logo" class="logo-3d-container logo-fullscreen" style="opacity: 0.15;"></div>

<script type="module">
    import initLogoAnimation from './assets/js/logo-animation.js';
    initLogoAnimation('background-logo');
</script>
```

## Troubleshooting

### Common Issues

1. **Logo not appearing**
   - Check if Three.js and Anime.js are properly loaded
   - Ensure the container has a height set
   - Check browser console for errors

2. **Performance issues**
   - Reduce the number of particles
   - Disable bloom effect
   - Use the logo animation only where necessary

3. **Logo appears too small/large**
   - Adjust the `size` parameter in the `config.text` object
   - Modify the container size using CSS

4. **Logo colors don't match brand guidelines**
   - Update the colors in the `config.colors` object to match your brand colors

### Browser Compatibility

The 3D logo animation works best in modern browsers that support WebGL:
- Chrome 9+
- Firefox 4+
- Safari 5.1+
- Edge 12+
- Opera 12+

For older browsers, consider providing a fallback static logo.
