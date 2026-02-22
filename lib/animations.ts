// Animation utilities for GSAP and Anime.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// GSAP fade in up animation
export const fadeInUp = (
  element: string | Element | Element[],
  delay: number = 0,
  duration: number = 0.6
) => {
  if (prefersReducedMotion()) return;
  
  return gsap.from(element, {
    y: 30,
    opacity: 0,
    duration,
    delay,
    ease: 'power3.out',
  });
};

// GSAP stagger animation for lists/grids
export const staggerReveal = (
  container: string | Element,
  items: string,
  stagger: number = 0.1
) => {
  if (prefersReducedMotion()) return;
  
  return gsap.from(`${container} ${items}`, {
    scrollTrigger: {
      trigger: container,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger,
    ease: 'power3.out',
  });
};

// Animated counter
export const animateCounter = (
  element: Element,
  targetValue: number,
  duration: number = 2,
  suffix: string = ''
) => {
  if (prefersReducedMotion()) {
    element.textContent = targetValue + suffix;
    return;
  }

  const obj = { value: 0 };
  
  return gsap.to(obj, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    value: targetValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix;
    },
  });
};

// Slide in from side
export const slideIn = (
  element: string | Element,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  distance: number = 50
) => {
  if (prefersReducedMotion()) return;
  
  const fromVars: gsap.TweenVars = { opacity: 0 };
  
  switch (direction) {
    case 'left':
      fromVars.x = -distance;
      break;
    case 'right':
      fromVars.x = distance;
      break;
    case 'top':
      fromVars.y = -distance;
      break;
    case 'bottom':
      fromVars.y = distance;
      break;
  }
  
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    ...fromVars,
    duration: 0.7,
    ease: 'power3.out',
  });
};

// Scale reveal
export const scaleReveal = (element: string | Element) => {
  if (prefersReducedMotion()) return;
  
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
  });
};

// Parallax effect
export const parallax = (element: string | Element, speed: number = 0.5) => {
  if (prefersReducedMotion()) return;
  
  return gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
    y: speed * 100,
    ease: 'none',
  });
};

// Reveal on scroll with clip-path
export const clipReveal = (element: string | Element) => {
  if (prefersReducedMotion()) return;
  
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    clipPath: 'inset(0 100% 0 0)',
    duration: 0.8,
    ease: 'power3.inOut',
  });
};
