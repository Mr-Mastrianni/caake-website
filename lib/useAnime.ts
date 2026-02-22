// Custom hook for Anime.js micro-interactions
import { useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';

// Check for reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Button hover animation
export const useButtonAnimation = () => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !buttonRef.current) return;
    
    const button = buttonRef.current;
    
    const handleMouseEnter = () => {
      anime({
        targets: button,
        scale: 1.02,
        duration: 300,
        easing: 'easeOutQuad',
      });
    };
    
    const handleMouseLeave = () => {
      anime({
        targets: button,
        scale: 1,
        duration: 300,
        easing: 'easeOutQuad',
      });
    };
    
    const handleMouseDown = () => {
      anime({
        targets: button,
        scale: 0.98,
        duration: 100,
        easing: 'easeOutQuad',
      });
    };
    
    const handleMouseUp = () => {
      anime({
        targets: button,
        scale: 1.02,
        duration: 100,
        easing: 'easeOutQuad',
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('mousedown', handleMouseDown);
    button.addEventListener('mouseup', handleMouseUp);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('mousedown', handleMouseDown);
      button.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return buttonRef;
};

// Card hover animation with icon rotation
export const useCardAnimation = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !cardRef.current) return;
    
    const card = cardRef.current;
    const icon = iconRef.current;
    
    const handleMouseEnter = () => {
      anime({
        targets: card,
        translateY: -8,
        boxShadow: '0 20px 40px rgba(212, 175, 55, 0.15)',
        duration: 400,
        easing: 'easeOutQuad',
      });
      
      if (icon) {
        anime({
          targets: icon,
          rotate: '1turn',
          scale: 1.1,
          duration: 600,
          easing: 'easeOutElastic(1, .5)',
        });
      }
    };
    
    const handleMouseLeave = () => {
      anime({
        targets: card,
        translateY: 0,
        boxShadow: '0 0 0 rgba(212, 175, 55, 0)',
        duration: 400,
        easing: 'easeOutQuad',
      });
      
      if (icon) {
        anime({
          targets: icon,
          rotate: 0,
          scale: 1,
          duration: 400,
          easing: 'easeOutQuad',
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { cardRef, iconRef };
};

// Pulse animation for emphasis elements
export const usePulseAnimation = (delay: number = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !elementRef.current) return;
    
    anime({
      targets: elementRef.current,
      boxShadow: [
        '0 0 0 rgba(212, 175, 55, 0)',
        '0 0 30px rgba(212, 175, 55, 0.3)',
        '0 0 0 rgba(212, 175, 55, 0)',
      ],
      duration: 2000,
      delay,
      loop: true,
      easing: 'easeInOutSine',
    });
  }, [delay]);

  return elementRef;
};

// Stagger animation for lists
export const useStaggerAnimation = (selector: string, stagger: number = 100) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;
    
    const items = containerRef.current.querySelectorAll(selector);
    if (items.length === 0) return;

    anime({
      targets: items,
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(stagger),
      duration: 600,
      easing: 'easeOutQuad',
    });
  }, [selector, stagger]);

  return containerRef;
};

// Form field focus animation
export const useFormFieldAnimation = () => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !inputRef.current) return;
    
    const input = inputRef.current;
    const parent = input.parentElement;
    
    const handleFocus = () => {
      anime({
        targets: parent,
        borderColor: '#D4AF37',
        boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)',
        duration: 200,
        easing: 'easeOutQuad',
      });
      
      anime({
        targets: input,
        scale: 1.01,
        duration: 200,
        easing: 'easeOutQuad',
      });
    };
    
    const handleBlur = () => {
      anime({
        targets: parent,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)',
        duration: 200,
        easing: 'easeOutQuad',
      });
      
      anime({
        targets: input,
        scale: 1,
        duration: 200,
        easing: 'easeOutQuad',
      });
    };

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);

    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, []);

  return inputRef;
};

// Success checkmark animation
export const animateSuccess = (element: HTMLElement) => {
  if (prefersReducedMotion()) return;
  
  anime.timeline()
    .add({
      targets: element,
      scale: [0, 1.2, 1],
      opacity: [0, 1],
      duration: 600,
      easing: 'easeOutElastic(1, .5)',
    })
    .add({
      targets: element.querySelectorAll('path'),
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: 400,
      easing: 'easeOutQuad',
    }, '-=300');
};

// Icon loop animation (for decorative elements)
export const useIconLoop = () => {
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !iconRef.current) return;
    
    anime({
      targets: iconRef.current,
      rotate: '1turn',
      duration: 8000,
      loop: true,
      easing: 'linear',
    });
  }, []);

  return iconRef;
};

// Floating animation
export const useFloatAnimation = (delay: number = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !elementRef.current) return;
    
    anime({
      targets: elementRef.current,
      translateY: [-10, 10],
      duration: 3000,
      delay,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutSine',
    });
  }, [delay]);

  return elementRef;
};

// Number counting animation (alternative to GSAP)
export const animateNumber = (
  element: HTMLElement,
  target: number,
  duration: number = 2000,
  suffix: string = ''
) => {
  if (prefersReducedMotion()) {
    element.textContent = target + suffix;
    return;
  }
  
  const obj = { value: 0 };
  
  anime({
    targets: obj,
    value: target,
    duration,
    easing: 'easeOutExpo',
    update: () => {
      element.textContent = Math.round(obj.value) + suffix;
    },
  });
};

// Draw SVG path animation (for crown/circuit effects)
export const drawPath = (selector: string, duration: number = 1500) => {
  if (prefersReducedMotion()) return;
  
  anime({
    targets: selector,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration,
    easing: 'easeInOutSine',
  });
};

// Ripple effect for buttons
export const createRipple = (event: React.MouseEvent<HTMLElement>, color: string = 'rgba(212, 175, 55, 0.3)') => {
  if (prefersReducedMotion()) return;
  
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const circle = document.createElement('span');
  
  const diameter = Math.max(rect.width, rect.height);
  const radius = diameter / 2;
  
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.style.position = 'absolute';
  circle.style.borderRadius = '50%';
  circle.style.background = color;
  circle.style.transform = 'scale(0)';
  circle.style.pointerEvents = 'none';
  
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(circle);
  
  anime({
    targets: circle,
    scale: [0, 2.5],
    opacity: [1, 0],
    duration: 600,
    easing: 'easeOutQuad',
    complete: () => {
      circle.remove();
    },
  });
};
