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
            }
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
            fetch('data/menu-data.json')
                .then(response => response.json())
                .then(data => {
                    this.menuData = data;
                })
                .catch(error => {
                    console.error('Error loading menu data:', error);
                });
        },
        setView(view) {
            this.currentView = view;
            this.searchQuery = '';
            // Scroll to top when changing views
            window.scrollTo({ top: 0, behavior: 'smooth' });
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
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

            // Initialize GLightbox
            if (typeof GLightbox !== 'undefined') {
                const lightbox = GLightbox({
                    touchNavigation: true,
                    loop: true,
                    autoplayVideos: false
                });
            }

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