# Anime.js v4 Documentation for Developers

Anime.js v4 is a fast, versatile, and lightweight JavaScript animation library designed to animate anything on the web with a single API. Released on April 3, 2025, by Julian Garnier, this version introduces a modular API, high performance (capable of animating 3,000 DOM elements at 60 fps on a 2019 MacBook Pro), and new features like scroll-linked animations, draggables, and Web Animations API (WAAPI) support. This guide provides everything you need to integrate Anime.js v4 into your coding workflow, with practical examples and best practices.

## Table of Contents
- [Installation](#installation)
- [Key Features](#key-features)
- [Basic Usage](#basic-usage)
- [Core Concepts](#core-concepts)
- [Targets](#targets)
- [Properties](#properties)
- [Easing](#easing)
- [Timelines](#timelines)
- [Staggering](#staggering)
- [Advanced Features](#advanced-features)
- [Scroll-Linked Animations](#scroll-linked-animations)
- [Draggables](#draggables)
- [Additive Animations](#additive-animations)
- [Responsive Animations](#responsive-animations)
- [Integration with 3D Libraries](#integration-with-3d-libraries)
- [WAAPI Support](#waapi-support)
- [Examples](#examples)
- [Basic DOM Animation](#basic-dom-animation)
- [Scroll-Linked Animation](#scroll-linked-animation)
- [Draggable Element](#draggable-element)
- [Timeline Animation](#timeline-animation)
- [Counter Animation](#counter-animation)
- [3D Animation with Three.js](#3d-animation-with-threejs)
- [Performance Tips](#performance-tips)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## Installation

### 1. Via npm (Recommended for Modular Usage)
Anime.js v4's modular API allows you to import only the features you need, keeping your bundle size small.
```bash
npm install animejs
```

Import the core library or specific modules:
```javascript
// Import the entire library
import anime from 'animejs';

// Import specific modules (e.g., for draggables)
import { createDraggable } from 'animejs';
```

### 2. Via CDN (For Quick Testing)
If you're prototyping or don't need a build system, use the CDN:
```html
<script src="https://unpkg.com/animejs@4.0.0/lib/anime.min.js"></script>
```

The library will be available globally as `anime`.

### 3. Project Setup
Ensure your project has a basic HTML structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anime.js v4 Example</title>
    <style>
        .box {
            width: 100px;
            height: 100px;
            background-color: #3498db;
            margin: 20px;
        }
    </style>
</head>
<body>
    <div class="box"></div>
    <script type="module">
        import anime from 'https://unpkg.com/animejs@4.0.0/lib/anime.es.js';
        // Your animation code here
    </script>
</body>
</html>
```

## Key Features
Anime.js v4 introduces several powerful features:
- **Modular API**: Import only what you need to reduce bundle size.
- **High Performance**: Animate thousands of elements smoothly (e.g., 3,000 DOM elements at 60 fps on a 2019 MacBook Pro).
- **Scroll-Linked Animations**: Tie animations to scroll position.
- **Draggables**: Create interactive draggable elements.
- **Responsive Animations**: Adjust animations based on screen size or device.
- **Additive Animations**: Layer multiple animations on the same element without conflicts.
- **WAAPI Support**: Leverage the Web Animations API for native browser performance.
- **Integration with 3D Libraries**: Works with Three.js and Babylon.js for 3D animations.

## Basic Usage
Here's a simple example to animate a DOM element:
```javascript
import anime from 'animejs';

anime({
    targets: '.box',
    translateX: 250,
    duration: 800,
    easing: 'easeInOutQuad'
});
```

This moves an element with the class `box` 250 pixels to the right over 800 milliseconds using a smooth easing function.

## Core Concepts

### Targets
The `targets` property defines what to animate. It can be:
- **CSS Selectors**: '.box', '#my-id', 'div'
- **DOM Nodes**: document.querySelector('.box')
- **NodeList**: document.querySelectorAll('.box')
- **JavaScript Objects**: { value: 0 }
- **Arrays**: ['.box1', '.box2']

### Properties
You can animate:
- **CSS Properties**: opacity, width, backgroundColor
- **Transform Properties**: translateX, scale, rotate
- **SVG Attributes**: stroke-dashoffset
- **Object Properties**: { value: 100 }

Note: Transform properties (translateX, scale, etc.) are more performant than layout-changing properties (width, top).

### Easing
Easing controls the animation's timing. Anime.js supports:
- **Built-in Easings**: 'linear', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', etc.
- **Spring Easing**: 'spring(mass, stiffness, damping, velocity)'
- **Custom Easing**: Use a cubic Bézier curve or a function.

Example:
```javascript
anime({
    targets: '.box',
    translateX: 250,
    easing: 'spring(1, 80, 10, 0)' // Bouncy effect
});
```

### Timelines
Timelines let you sequence animations:
```javascript
const tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 750
});

tl
.add({
    targets: '.box1',
    translateX: 250
})
.add({
    targets: '.box2',
    translateX: 250
}, '-=500'); // Overlap by 500ms
```

### Staggering
Stagger animations across multiple elements for a wave-like effect:
```javascript
anime({
    targets: '.grid-item',
    translateX: 100,
    delay: anime.stagger(100) // 100ms delay between each element
});
```

## Advanced Features

### Scroll-Linked Animations
Tie animations to the user's scroll position:
```javascript
const animation = anime({
    targets: '.progress-bar',
    width: ['0%', '100%'],
    easing: 'linear',
    autoplay: false
});

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    animation.seek((scrollPercent / 100) * animation.duration);
});
```

### Draggables
Create draggable elements with `createDraggable()`:
```javascript
import { createDraggable } from 'animejs';

const draggable = createDraggable('.draggable', {
    onDrag: ({ x, y }) => {
        anime({
            targets: '.draggable',
            translateX: x,
            translateY: y,
            duration: 0
        });
    },
    onRelease: () => {
        anime({
            targets: '.draggable',
            translateX: 0,
            translateY: 0,
            easing: 'spring(1, 80, 10, 0)'
        });
    }
});
```

### Additive Animations
Layer animations without conflicts:
```javascript
anime({
    targets: '.button',
    scale: [1, 1.05],
    duration: 1000,
    direction: 'alternate',
    loop: true
});

document.querySelector('.button').addEventListener('mouseenter', () => {
    anime({
        targets: '.button',
        scale: 1.2,
        duration: 300,
        additive: true
    });
});
```

### Responsive Animations
Adjust animations based on screen size:
```javascript
const isMobile = window.innerWidth <= 768;

anime({
    targets: '.hero-image',
    scale: isMobile ? 1.2 : 1.5,
    duration: 800,
    easing: 'easeOutExpo'
});
```

### Integration with 3D Libraries
Anime.js integrates with Three.js and Babylon.js:
```javascript
import * as THREE from 'three';

const mesh = new THREE.Mesh(/* geometry, material */);

anime({
    targets: mesh.rotation,
    x: Math.PI * 2,
    duration: 2000,
    easing: 'easeInOutQuad',
    loop: true,
    update: () => {
        mesh.rotation.set(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
    }
});
```

### WAAPI Support
Use the Web Animations API for better performance:
```javascript
anime({
    targets: '.dot',
    translateX: 100,
    useWAAPI: true
});
```

## Examples

### Basic DOM Animation
Fade in and slide an element:
```javascript
anime({
    targets: '.box',
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 1000,
    easing: 'easeOutQuad'
});
```

### Scroll-Linked Animation
Animate a progress bar based on scroll:
```javascript
const animation = anime({
    targets: '.progress-bar',
    width: ['0%', '100%'],
    easing: 'linear',
    autoplay: false
});

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    animation.seek((scrollPercent / 100) * animation.duration);
});
```

### Draggable Element
Make an element draggable with a spring-back effect:
```javascript
import { createDraggable } from 'animejs';

const draggable = createDraggable('.box', {
    onDrag: ({ x, y }) => {
        anime({
            targets: '.box',
            translateX: x,
            translateY: y,
            duration: 0
        });
    },
    onRelease: () => {
        anime({
            targets: '.box',
            translateX: 0,
            translateY: 0,
            easing: 'spring(1, 80, 10, 0)'
        });
    }
});
```

### Timeline Animation
Sequence animations for a loading effect:
```javascript
const tl = anime.timeline({
    easing: 'easeOutExpo',
    duration: 750
});

tl
.add({
    targets: '.logo',
    opacity: [0, 1],
    translateY: [-20, 0]
})
.add({
    targets: '.nav-item',
    opacity: [0, 1],
    translateX: [-20, 0],
    delay: anime.stagger(100)
}, '-=500')
.add({
    targets: '.hero-content',
    opacity: [0, 1],
    scale: [0.9, 1]
});
```

### Counter Animation
Animate a numerical counter:
```javascript
const counter = { value: 0 };
const counterElement = document.querySelector('.counter');

anime({
    targets: counter,
    value: 100,
    round: 1,
    duration: 2000,
    easing: 'easeInOutQuad',
    update: () => {
        counterElement.textContent = counter.value;
    }
});
```

### 3D Animation with Three.js
Rotate a 3D mesh:
```javascript
import * as THREE from 'three';

const mesh = new THREE.Mesh(/* geometry, material */);

anime({
    targets: mesh.rotation,
    x: Math.PI * 2,
    duration: 2000,
    easing: 'easeInOutQuad',
    loop: true,
    update: () => {
        mesh.rotation.set(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
    }
});
```

## Performance Tips
- **Use Transform Properties**: Animate opacity and transform (e.g., translateX, scale) instead of layout-changing properties (width, top) to avoid repaints.
- **Enable WAAPI**: Use `useWAAPI: true` for large-scale animations to leverage native browser performance.
- **Stagger Wisely**: Use `anime.stagger()` to animate multiple elements efficiently.
- **Test on Devices**: Ensure animations are smooth on mobile and low-end devices.
- **Limit Animated Elements**: If animating thousands of elements, consider simplifying the animation or using WAAPI.

## Troubleshooting
- **Animation Not Running**: Check if targets matches your elements. Use `console.log(document.querySelectorAll('.your-class'))` to debug.
- **Choppy Animations**: Switch to transform properties or enable `useWAAPI: true`.
- **Module Not Found**: Ensure you've installed Anime.js via npm and are using a module bundler like Webpack or Vite.
- **Scroll Animations Not Working**: Verify the scroll event listener is firing and the scroll percentage calculation is correct.

## Resources
- **Official Website**: [animejs.com](https://animejs.com)
- **Documentation**: [animejs.com/documentation](https://animejs.com/documentation)
- **GitHub**: [github.com/juliangarnier/anime](https://github.com/juliangarnier/anime)
- **Sponsor Anime.js**: [github.com/sponsors/juliangarnier](https://github.com/sponsors/juliangarnier)
