// performance-fix.js

// Throttling scroll events to improve performance
function throttle(fn, wait) {
    let time = Date.now();
    return function(...args) {
        if ((time + wait - Date.now()) < 0) {
            fn.apply(this, args);
            time = Date.now();
        }
    };
}

// Hardware acceleration for animations
function enableHardwareAcceleration(element) {
    element.style.willChange = 'transform';
}

// Intersection Observer for lazy loading and reducing workload
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Perform actions when the element comes into view
            enableHardwareAcceleration(entry.target);
        }
    });
});

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Your scroll-related code here
    console.log('Scroll event triggered!');
}, 100));

// Observe elements for performance improvements
const elementsToObserve = document.querySelectorAll('.observe');
elementsToObserve.forEach(element => observer.observe(element));

// Example function to initialize performance optimizations
function initPerformanceOptimizations() {
    elementsToObserve.forEach(enableHardwareAcceleration);
}

// Call the optimization function on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);