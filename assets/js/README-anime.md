# Using Anime.js with CAAKE Website

This document provides guidance on how to implement animations using Anime.js v4 in the CAAKE website.

## Overview

Anime.js is a lightweight JavaScript animation library that works with CSS properties, SVG, DOM attributes, and JavaScript Objects. It's been added to the CAAKE website to enhance user experience with smooth, performant animations.

## Implementation Files

- `anime-js-v4-documentation.md` - Comprehensive documentation of Anime.js v4 features
- `assets/js/anime-examples.js` - Ready-to-use animation functions for the CAAKE website
- `examples/anime-js-demo.html` - Interactive demo page showcasing Anime.js capabilities

## Getting Started

### 1. Install Anime.js

The package.json has been updated to include Anime.js as a dependency. Run:

```bash
npm install
```

### 2. Import Anime.js in Your JavaScript File

```javascript
// Option 1: Import from node_modules (if using a build system)
import anime from 'animejs';

// Option 2: Import from CDN (for quick prototyping)
import anime from 'https://unpkg.com/animejs@4.0.0/lib/anime.es.js';
```

### 3. Use the Pre-built Animation Functions

The `assets/js/anime-examples.js` file contains ready-to-use animation functions:

```javascript
// Import the animation functions
import { 
    initHeroAnimation, 
    initServiceCardAnimations,
    initCounterAnimations,
    initScrollLinkedAnimations,
    setupAnimeAttributeAnimations
} from './anime-examples.js';

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimation();
    initServiceCardAnimations();
    initCounterAnimations();
    initScrollLinkedAnimations();
    setupAnimeAttributeAnimations();
});
```

## Animation Techniques

### 1. Using Data Attributes

The simplest way to add animations is by using data attributes in your HTML:

```html
<!-- Add data-anime attribute to elements you want to animate -->
<div data-anime="fadeIn">This will fade in when visible</div>
<div data-anime="slideUp" data-anime-delay="300">This will slide up with a 300ms delay</div>
<div data-anime="bounce" data-anime-delay="600">This will bounce with a 600ms delay</div>
```

Available animation types:
- `fadeIn` - Simple fade in
- `slideUp` - Slide up while fading in
- `slideLeft` - Slide from right to left
- `slideRight` - Slide from left to right
- `zoomIn` - Scale up while fading in
- `bounce` - Bouncy entrance animation

### 2. Creating Timeline Animations

For more complex, sequenced animations:

```javascript
const timeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 750
});

timeline
    .add({
        targets: '.hero h1',
        opacity: [0, 1],
        translateY: [50, 0]
    })
    .add({
        targets: '.hero p',
        opacity: [0, 1],
        translateY: [30, 0]
    }, '-=600') // Start 600ms before the previous animation ends
    .add({
        targets: '.hero .cta-button',
        opacity: [0, 1],
        scale: [0.9, 1]
    }, '-=400'); // Start 400ms before the previous animation ends
```

### 3. Scroll-Linked Animations

To create animations that progress based on scroll position:

```javascript
const progressBar = document.querySelector('.progress-bar');
const progressAnimation = anime({
    targets: progressBar,
    width: ['0%', '100%'],
    easing: 'linear',
    autoplay: false // Don't play automatically
});

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressAnimation.seek((scrollPercent / 100) * progressAnimation.duration);
});
```

## Integration with Existing Animations

The CAAKE website already uses some animation techniques. When integrating Anime.js:

1. **Check for Conflicts**: Ensure Anime.js animations don't conflict with existing animations
2. **Performance**: Use the browser's developer tools to monitor performance
3. **Progressive Enhancement**: Implement animations as progressive enhancements that don't break the site if they fail

## Examples

See the `examples/anime-js-demo.html` file for interactive examples of all animation techniques.

## Resources

- [Full Anime.js v4 Documentation](../../anime-js-v4-documentation.md)
- [Official Anime.js Website](https://animejs.com)
- [Anime.js GitHub Repository](https://github.com/juliangarnier/anime)
