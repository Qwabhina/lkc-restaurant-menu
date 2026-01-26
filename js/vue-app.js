// Lancaster Restaurant - Vue.js Application
// Main Vue application with integrated logic and hash-based routing

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            currentView: 'home',
            searchQuery: '',
            menuData: {
                aLaCarte: [],
                beverages: [],
                cocktails: []
            },
            isLoading: false,
            lightboxInstance: null,
            observer: null
        }
    },
    computed: {
        filteredCategories() {
            const currentMenu = this.menuData[this.currentView] || [];
            
            if (!this.searchQuery.trim()) {
                return currentMenu.map(category => ({
                    ...category,
                    open: category.open || false
                }));
            }
            
            const query = this.searchQuery.toLowerCase();
            return currentMenu.map(category => {
                const filteredItems = category.items.filter(item => 
                    item.name.toLowerCase().includes(query) || 
                    (item.description && item.description.toLowerCase().includes(query))
                );
                
                if (filteredItems.length > 0) {
                    return {
                        ...category,
                        items: filteredItems,
                        open: true
                    };
                }
                return null;
            }).filter(category => category !== null);
        },
        currentMenuTitle() {
            switch(this.currentView) {
                case 'home': return 'Lancaster Restaurant';
                case 'aLaCarte': return 'À La Carte';
                case 'beverages': return 'Beverages';
                case 'cocktails': return 'Cocktails & Mocktails';
                default: return 'Menu';
            }
        }
    },
    methods: {
        toggleCategory(categoryId) {
            const currentMenu = this.menuData[this.currentView] || [];
            const category = currentMenu.find(c => c.id === categoryId);
            if (category) {
                category.open = !category.open;
            }
        },
        getMenuDescription(view) {
            switch(view) {
                case 'aLaCarte': return 'Discover our carefully crafted selection of appetizers, mains, and desserts';
                case 'beverages': return 'Refresh yourself with our selection of wines, spirits, beers, and soft drinks';
                case 'cocktails': return 'Expertly crafted cocktails and refreshing mocktails for every taste';
                default: return '';
            }
        },
        formatPrice(price) {
            if (Array.isArray(price)) {
                return price.map(p => `GH₵ ${p.toFixed(2)}`).join(' | ');
            }
            return `GH₵ ${price.toFixed(2)}`;
        },
        loadMenuData() {
            this.isLoading = true;
            fetch('data/menu-data.json')
                .then(response => response.json())
                .then(data => {
                    this.menuData = data;
                    this.isLoading = false;
                    this.$nextTick(() => {
                        this.initializeUI();
                    });
                })
                .catch(error => {
                    console.error('Error loading menu data:', error);
                    this.isLoading = false;
                });
        },
        setView(view) {
            // Update hash, which will trigger handleHashChange
            window.location.hash = view === 'home' ? '' : view;
        },
        handleHashChange() {
            const hash = window.location.hash.slice(1); // Remove the '#'
            const validViews = ['home', 'aLaCarte', 'beverages', 'cocktails'];
            
            // Default to 'home' if hash is empty or invalid
            const newView = validViews.includes(hash) ? hash : 'home';
            
            if (this.currentView !== newView) {
                this.currentView = newView;
                this.searchQuery = '';
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Close mobile menu if open
                this.closeMobileMenu();
                
                // Re-run UI initialization after DOM update
                this.$nextTick(() => {
                    this.initializeUI();
                });
            }
        },
        closeMobileMenu() {
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        },
        initializeLightbox() {
            if (typeof GLightbox !== 'undefined') {
                if (this.lightboxInstance) {
                    this.lightboxInstance.destroy();
                }
                
                this.lightboxInstance = GLightbox({
                    selector: '.glightbox',
                    touchNavigation: true,
                    loop: true,
                    autoplayVideos: false,
                    openEffect: 'fade',
                    closeEffect: 'fade',
                    slideEffect: 'slide'
                });
            }
        },
        focusSearch() {
            const searchInput = document.querySelector('input[type="text"]');
            if (searchInput) {
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                searchInput.focus();
            }
        },
        setupIntersectionObserver() {
            if ('IntersectionObserver' in window) {
                // Disconnect previous observer if exists
                if (this.observer) {
                    this.observer.disconnect();
                }

                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                            // Optional: Stop observing once animated
                            // this.observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                // Observe elements
                const animateElements = document.querySelectorAll('.menu-category, .category-card');
                animateElements.forEach(el => this.observer.observe(el));
            }
        },
        initializeUI() {
            // Initialize AOS if available (though we are moving to manual IntersectionObserver for better control)
            if (typeof AOS !== 'undefined') {
                AOS.refresh(); 
            }

            this.initializeLightbox();
            this.setupIntersectionObserver();

            // Navbar scroll effect
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                // Remove existing listener to avoid duplicates if possible, or just add one in mounted
                // For simplicity in this structure, we'll check if we added a flag or just leave it (browsers handle duplicate named listeners well, but anonymous ones stack)
                // Better to do this once in mounted.
            }
        }
    },
    mounted() {
        this.loadMenuData();
        
        // Handle initial hash
        this.handleHashChange();
        
        // Listen for hash changes
        window.addEventListener('hashchange', this.handleHashChange);

        // Initialize AOS once
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-in-out',
                once: true,
                offset: 50,
                disable: 'mobile'
            });
        }

        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 30) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const navbar = document.querySelector('.navbar');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            const navbarToggler = document.querySelector('.navbar-toggler');
            
            if (navbar && navbarCollapse && navbarToggler && 
                !navbar.contains(e.target) && 
                navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    },
    updated() {
        // Re-initialize UI components when the DOM updates
        this.$nextTick(() => {
            this.initializeUI();
        });
    }
});

// Mount the Vue application
document.addEventListener('DOMContentLoaded', function() {
    app.mount('#app');
});
