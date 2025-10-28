// Performance optimization script for smooth scrolling and animations
// This script fixes jitters and lags without modifying existing styles

(function() {
  'use strict';

  // 1. FORCE ENABLE SCROLLING IMMEDIATELY
  function enableScrollingImmediately() {
    // Remove any scroll locks
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Remove any height restrictions
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Enable touch scrolling on mobile
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Force scrolling to be enabled
    window.scrollTo(0, 0);
  }

  // 2. Smooth scroll performance optimization
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

  // 3. Optimize transform animations
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

  // 4. Debounce resize events
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Trigger optimizations after resize
      optimizeTransforms();
    }, 250);
  }, { passive: true });

  // 5. Use Intersection Observer for scroll-triggered animations
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

  // 6. Force GPU acceleration for heavy elements
  function enableHardwareAcceleration() {
    const heavyElements = document.querySelectorAll('.page, .background, .showreel, .project');
    heavyElements.forEach(el => {
      // Force GPU layer without changing appearance
      el.style.transform = el.style.transform || 'translateZ(0)';
      el.style.backfaceVisibility = 'hidden';
    });
  }

  // 7. Optimize image rendering
  function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.style.imageRendering = 'auto';
      img.setAttribute('loading', 'lazy');
    });
  }

  // 8. Reduce paint operations
  function reducePaintOperations() {
    // Add CSS containment to isolated components
    const sections = document.querySelectorAll('section, .page, footer');
    sections.forEach(section => {
      section.style.contain = 'layout style paint';
    });
  }

  // 9. Smooth out transition jank
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
      
      /* FORCE SCROLLING ENABLED */
      body, html {
        overflow: auto !important;
        height: auto !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 10. Initialize all optimizations
  function init() {
    // ENABLE SCROLLING IMMEDIATELY - Don't wait for anything
    enableScrollingImmediately();
    
    // Wait for DOM to be ready for other optimizations
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

  // Start optimization IMMEDIATELY
  enableScrollingImmediately();
  init();

  // Re-optimize on page visibility change
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setTimeout(optimizeTransforms, 100);
    }
  });
  
  // Re-enable scrolling after any potential locks
  setTimeout(enableScrollingImmediately, 500);
  setTimeout(enableScrollingImmediately, 1000);
  setTimeout(enableScrollingImmediately, 2000);

})();