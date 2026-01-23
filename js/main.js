// Lancaster Restaurant Menu - Vue.js Application Support
// This file provides utility functions and initialization for the Vue.js application

console.log('Lancaster Restaurant Menu - Vue.js application loaded');

// Initialize UI components that work alongside Vue
(function() {
    // Initialize GLightbox for image lightbox
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: false
        });
    }

    // Mobile navigation improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbar = document.querySelector('.navbar');
    
    if (navbarToggler && navbarCollapse && navbar) {
        // Close mobile menu when clicking on a link
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    }

    // Optimize images and content loading
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.loading = 'lazy';
    });

    // Performance optimization: Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.menu-category, .category-card');
        animateElements.forEach(el => observer.observe(el));
    }
})();


// Utility functions for Vue.js application

// Mobile-optimized print functionality
function printMenu() {
    // Expand all categories before printing
    const menuItems = document.querySelectorAll('.menu-items');
    const toggles = document.querySelectorAll('.category-toggle');
    
    menuItems.forEach(item => item.classList.add('show'));
    toggles.forEach(toggle => toggle.classList.add('rotated'));
    
    window.print();
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
}

measurePerformance();