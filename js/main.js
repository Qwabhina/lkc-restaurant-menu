// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            offset: 50,
            disable: 'mobile' // Disable on mobile for better performance
        });
    }

    // Initialize GLightbox for image lightbox
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            autoplayVideos: false,
            plyr: {
                css: 'https://cdn.plyr.io/3.6.8/plyr.css',
                js: 'https://cdn.plyr.io/3.6.8/plyr.js'
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile-optimized menu category collapsible functionality
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    if (categoryHeaders.length > 0) {
        categoryHeaders.forEach((header, index) => {
            header.addEventListener('click', function(e) {
                e.preventDefault();
                const menuItems = this.nextElementSibling;
                const toggle = this.querySelector('.category-toggle');
                
                if (!menuItems || !toggle) return;
                
                const isOpen = menuItems.classList.contains('show');
                
                // Close all other categories on mobile for better UX
                if (window.innerWidth < 768) {
                    categoryHeaders.forEach((otherHeader, otherIndex) => {
                        if (otherIndex !== index) {
                            const otherMenuItems = otherHeader.nextElementSibling;
                            const otherToggle = otherHeader.querySelector('.category-toggle');
                            if (otherMenuItems && otherToggle) {
                                otherMenuItems.classList.remove('show');
                                otherToggle.classList.remove('rotated');
                            }
                        }
                    });
                }
                
                if (isOpen) {
                    // Close this category
                    menuItems.classList.remove('show');
                    toggle.classList.remove('rotated');
                } else {
                    // Open this category with staggered animation
                    menuItems.classList.add('show');
                    toggle.classList.add('rotated');
                    
                    // Add staggered animation to cards
                    const cards = menuItems.querySelectorAll('.menu-item');
                    cards.forEach((card, cardIndex) => {
                        card.style.animationDelay = `${cardIndex * 0.1}s`;
                        card.classList.add('menu-item-enter');
                    });
                    
                    // Scroll to category header on mobile
                    if (window.innerWidth < 768) {
                        setTimeout(() => {
                            const headerTop = this.offsetTop - 80;
                            window.scrollTo({
                                top: headerTop,
                                behavior: 'smooth'
                            });
                        }, 100);
                    }
                }
            });
        });

        // Initialize first category as open
        const firstCategory = document.querySelector('.menu-category');
        if (firstCategory) {
            const firstMenuItems = firstCategory.querySelector('.menu-items');
            const firstToggle = firstCategory.querySelector('.category-toggle');
            if (firstMenuItems && firstToggle) {
                firstMenuItems.classList.add('show');
                firstToggle.classList.add('rotated');
                
                // Add initial animation to first category cards
                const firstCards = firstMenuItems.querySelectorAll('.menu-item');
                firstCards.forEach((card, cardIndex) => {
                    setTimeout(() => {
                        card.style.animationDelay = `${cardIndex * 0.1}s`;
                        card.classList.add('menu-item-enter');
                    }, 500); // Delay to allow page to load
                });
            }
        }
    }

    // Floating search button functionality
    const floatingSearchBtn = document.querySelector('#floatingSearchBtn');
    const searchInput = document.querySelector('#menuSearch');
    
    if (floatingSearchBtn && searchInput) {
        floatingSearchBtn.addEventListener('click', function() {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    // Mobile-optimized search functionality
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                const menuCategories = document.querySelectorAll('.menu-category');
                
                // Only run search if we have menu categories (not on homepage)
                if (menuCategories.length === 0) return;
                
                if (searchTerm === '') {
                    // Show all categories and items
                    menuCategories.forEach(category => {
                        category.style.display = 'block';
                        const menuItems = category.querySelectorAll('.menu-item');
                        menuItems.forEach(item => {
                            item.style.display = 'block';
                        });
                    });
                } else {
                    // Filter items and categories
                    menuCategories.forEach(category => {
                        const menuItems = category.querySelectorAll('.menu-item');
                        let hasVisibleItems = false;
                        
                        menuItems.forEach(item => {
                            const itemNameElement = item.querySelector('.item-name');
                            const itemDescriptionElement = item.querySelector('.item-description');
                            
                            // Check if elements exist before accessing textContent
                            if (itemNameElement) {
                                const itemName = itemNameElement.textContent.toLowerCase();
                                const description = itemDescriptionElement ? itemDescriptionElement.textContent.toLowerCase() : '';
                                
                                if (itemName.includes(searchTerm) || description.includes(searchTerm)) {
                                    item.style.display = 'block';
                                    hasVisibleItems = true;
                                } else {
                                    item.style.display = 'none';
                                }
                            }
                        });
                        
                        // Show/hide category based on whether it has visible items
                        category.style.display = hasVisibleItems ? 'block' : 'none';
                        
                        // Auto-expand categories with search results
                        if (hasVisibleItems) {
                            const menuItemsContainer = category.querySelector('.menu-items');
                            const toggle = category.querySelector('.category-toggle');
                            if (menuItemsContainer && toggle) {
                                menuItemsContainer.classList.add('show');
                                toggle.classList.add('rotated');
                            }
                        }
                    });
                }
            }, 300); // Debounce search for better performance
        });
    }

    // Touch-friendly interactions for menu items
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuItems.length > 0) {
        menuItems.forEach(item => {
            // Add touch feedback
            item.addEventListener('touchstart', function() {
                this.style.backgroundColor = 'rgba(30, 58, 138, 0.05)';
            });
            
            item.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 150);
            });
            
            // Prevent hover effects on touch devices
            if ('ontouchstart' in window) {
                item.addEventListener('mouseenter', function(e) {
                    e.preventDefault();
                });
            }
        });
    }

    // Price formatting for better mobile display
    const prices = document.querySelectorAll('.item-price');
    prices.forEach(price => {
        const text = price.textContent;
        if (text.includes('GH₵') || text.includes('GHC')) {
            price.style.color = 'var(--primary-color)';
            price.style.fontWeight = '700';
        }
    });

    // Mobile navigation improvements
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
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

    // Add loading states for better perceived performance
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').includes('.html')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
                this.disabled = true;
                
                // Re-enable after a short delay if navigation fails
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 3000);
            }
        });
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
});

// Utility functions
function formatPrice(price) {
    return price.replace(/GHC/g, 'GH₵');
}

function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    if (!category) return;
    
    const menuItems = category.querySelector('.menu-items');
    const toggle = category.querySelector('.category-toggle');
    
    if (menuItems && toggle) {
        const isOpen = menuItems.classList.contains('show');
        
        if (isOpen) {
            menuItems.classList.remove('show');
            toggle.classList.remove('rotated');
        } else {
            menuItems.classList.add('show');
            toggle.classList.add('rotated');
        }
    }
}

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