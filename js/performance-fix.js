// Performance optimization script for smooth scrolling and animations
// This script fixes jitters and lags without modifying existing styles

(function() {
  'use strict';

  // 1. Smooth scroll performance optimization
  let rafId = null;
  let lastScrollY = window.scrollY;
  
  // Throttle scroll events using requestAnimationFrame
  function optimizeScrollEvents() {
    const scrollHandler = function() {
      lastScrollY = window.scrollY;
      rafId = null;
    };

    window.addEventListener('scroll', function() {
      if (rafId === null) {
        rafId = requestAnimationFrame(scrollHandler);
      }
    }, { passive: true });
  }

  // 2. Optimize transform animations
  function optimizeTransforms() {
    // Add will-change hints to animated elements
    const animatedElements = document.querySelectorAll('[style*="transform"]');
    animatedElements.forEach(el => {
      el.style.willChange = 'transform';
      // Remove will-change after animation completes to free resources
      setTimeout(() => {
        el.style.willChange = 'auto';
      }, 3000);
    });
  }

  // 3. Debounce resize events
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Trigger optimizations after resize
      optimizeTransforms();
    }, 250);
  }, { passive: true });

  // 4. Use Intersection Observer for scroll-triggered animations
  function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.willChange = 'transform, opacity';
            } else {
              entry.target.style.willChange = 'auto';
            }
          });
        },
        { rootMargin: '50px' }
      );

      // Observe elements that animate on scroll
      document.querySelectorAll('.project, .page, [data-v-4aa72278]').forEach(el => {
        observer.observe(el);
      });
    }
  }

  // 5. Force GPU acceleration for heavy elements
  function enableHardwareAcceleration() {
    const heavyElements = document.querySelectorAll('.page, .background, .showreel, .project');
    heavyElements.forEach(el => {
      // Force GPU layer without changing appearance
      el.style.transform = el.style.transform || 'translateZ(0)';
      el.style.backfaceVisibility = 'hidden';
    });
  }

  // 6. Optimize image rendering
  function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.imageRendering = 'auto';
      img.setAttribute('loading', 'lazy');
    });
  }

  // 7. Reduce paint operations
  function reducePaintOperations() {
    // Add CSS containment to isolated components
    const sections = document.querySelectorAll('section, .page, footer');
    sections.forEach(section => {
      section.style.contain = 'layout style paint';
    });
  }

  // 8. Smooth out transition jank
  function smoothTransitions() {
    // Override any janky transitions
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Optimize compositing */
      .page, .background, [style*="transform"] {
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* Prevent layout thrashing */
      img, video {
        content-visibility: auto;
      }
    `;
    document.head.appendChild(style);
  }

  // 9. Initialize all optimizations
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    optimizeScrollEvents();
    enableHardwareAcceleration();
    optimizeImages();
    reducePaintOperations();
    smoothTransitions();
    
    // Delay these to not block initial render
    setTimeout(() => {
      optimizeTransforms();
      setupIntersectionObserver();
    }, 100);
  }

  // Start optimization
  init();

  // Re-optimize on page visibility change
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(optimizeTransforms, 100);
    }
  });

})();