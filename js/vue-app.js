// Lancaster Restaurant - Vue.js Application
// Main Vue application extracted from index.html for better modularity

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
            lightboxInstance: null
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
                    // Reinitialize lightbox after data loads
                    this.$nextTick(() => {
                        this.initializeLightbox();
                    });
                })
                .catch(error => {
                    console.error('Error loading menu data:', error);
                    this.isLoading = false;
                });
        },
        setView(view) {
            if (this.currentView === view) return;
            
            this.currentView = view;
            this.searchQuery = '';
            
            // Ensure menu data is loaded for the selected view
            if (this.menuData[view].length === 0) {
                this.loadMenuData();
            }
            
            // Scroll to top when changing views
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
            
            // Reinitialize lightbox for new view
            this.$nextTick(() => {
                this.initializeLightbox();
            });
        },
        initializeLightbox() {
            if (typeof GLightbox !== 'undefined') {
                // Destroy existing lightbox instance if any
                if (this.lightboxInstance) {
                    this.lightboxInstance.destroy();
                }
                
                // Initialize new lightbox instance
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
        initializeUI() {
            // Initialize AOS
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 600,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 50,
                    disable: 'mobile'
                });
            }

            // Initialize lightbox
            this.initializeLightbox();

            // Navbar scroll effect
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 30) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        }
    },
    mounted() {
        this.loadMenuData();
        this.initializeUI();
    }
});

// Mount the Vue application
document.addEventListener('DOMContentLoaded', function() {
    app.mount('#app');
});