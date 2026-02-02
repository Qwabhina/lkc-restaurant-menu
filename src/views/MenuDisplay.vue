<template>
  <div class="container py-4">
    <!-- Back Button & Header -->
    <div class="d-flex align-items-center mb-4 fade-in-up">
        <router-link to="/" class="btn btn-outline-secondary rounded-circle me-3 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
            <i class="bi bi-arrow-left"></i>
        </router-link>
        <div>
            <h2 class="display-6 fw-bold text-navy mb-0">{{ sectionTitle }}</h2>
        </div>
    </div>

    <!-- Search Bar -->
    <div class="row justify-content-center mb-4 fade-in-up" style="animation-delay: 0.1s;">
        <div class="col-md-8 col-lg-6 position-relative">
            <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-muted fs-5"></i>
            <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control form-control-lg rounded-pill shadow-sm ps-5 border-0 bg-body py-3 search-input" 
                placeholder="Search..."
            >
            <Transition name="fade">
                <button 
                    v-if="searchQuery || selectedCategory !== 'all'" 
                    class="btn btn-link text-muted text-decoration-none position-absolute top-50 end-0 translate-middle-y me-3" 
                    @click="clearFilters"
                >
                    <i class="bi bi-x-circle-fill"></i> Clear
                </button>
            </Transition>
        </div>
    </div>

    <!-- Category Tabs (Only if multiple categories exist) -->
    <Transition name="fade">
        <div v-if="availableCategories.length > 1" class="position-sticky top-0 bg-body-tertiary py-3 mb-4 fade-in-up" style="z-index: 90; margin-top: -1rem; animation-delay: 0.2s;">
            <ul class="nav nav-pills d-flex gap-2 flex-nowrap overflow-auto pb-2 px-2 no-scrollbar" style="white-space: nowrap; -webkit-overflow-scrolling: touch;">
            <li class="nav-item">
                <a class="nav-link rounded-pill px-4" :class="{ active: selectedCategory === 'all' }" href="#" @click.prevent="selectedCategory = 'all'">
                    All
                </a>
            </li>
            <li class="nav-item" v-for="cat in availableCategories" :key="cat.id">
                <a class="nav-link rounded-pill px-4" :class="{ active: selectedCategory === cat.id }" href="#" @click.prevent="selectedCategory = cat.id">
                    {{ cat.name }}
                </a>
            </li>
            </ul>
        </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="isLoading" class="d-flex justify-content-center py-5">
        <div class="spinner-border text-navy" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <!-- Menu Grid -->
    <TransitionGroup v-else name="list" tag="div" class="row g-4">
      <div v-for="item in filteredItems" :key="item.name + item.price" class="col-md-6 col-lg-4 col-xl-3">
        <MenuItemCard :item="item" @preview="openPreview" />
      </div>
    </TransitionGroup>
    
    <!-- Empty State -->
    <div v-if="!isLoading && filteredItems.length === 0" class="text-center py-5 mt-4 fade-in">
        <div class="mb-3 text-muted display-1">
            <i class="bi bi-cup-hot"></i>
        </div>
        <h4 class="text-muted">No items found matching "{{ searchQuery }}"</h4>
        <button class="btn btn-outline-navy mt-3 rounded-pill px-4" @click="clearFilters">Clear Filters</button>
    </div>

    <!-- Image Preview Modal -->
    <ImagePreview 
      :show="showPreview" 
      :imageSrc="previewItem?.image" 
      :altText="previewItem?.name"
      :caption="previewItem?.name"
      :price="previewItem ? `${previewItem.currency}${previewItem.price.toFixed(2)}` : ''"
      @close="closePreview" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import menuData from '../menu.json';
import MenuItemCard from '../components/MenuItemCard.vue';
import ImagePreview from '../components/ImagePreview.vue';

const props = defineProps(['section']);
const route = useRoute();

const searchQuery = ref('');
const selectedCategory = ref('all');
const showPreview = ref(false);
const previewItem = ref(null);
const isLoading = ref(true);

// Define section titles
const sectionTitles = {
    'food': 'À La Carte Menu',
    'beverages': 'Beverages',
    'cocktails': 'Cocktails & Mocktails'
};

// Computed properties
const sectionTitle = computed(() => sectionTitles[props.section] || 'Menu');

const availableCategories = computed(() => {
    return menuData.categories.filter(cat => cat.section === props.section);
});

const filteredItems = computed(() => {
    let items = [];
    
    // 1. Filter by Section & Category
    if (selectedCategory.value === 'all') {
        availableCategories.value.forEach(cat => {
            items.push(...cat.items);
        });
    } else {
        const cat = menuData.categories.find(c => c.id === selectedCategory.value);
        if (cat) items = cat.items;
    }

    // 2. Filter by Search
    if (searchQuery.value) {
        const lower = searchQuery.value.toLowerCase();
        items = items.filter(item => 
            item.name.toLowerCase().includes(lower) || 
            (item.description && item.description.toLowerCase().includes(lower))
        );
    }
    
    return items;
});

// Actions
const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
};

const openPreview = (item) => {
  previewItem.value = item;
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
  setTimeout(() => {
    previewItem.value = null;
  }, 300);
};

// Simulate loading for effect
const loadData = () => {
    isLoading.value = true;
    setTimeout(() => {
        isLoading.value = false;
    }, 600);
};

watch(() => props.section, () => {
    clearFilters();
    loadData();
});

onMounted(() => {
    loadData();
});
</script>

<style scoped>
.nav-pills .nav-link {
    color: var(--brand-primary);
    background-color: var(--bs-body-bg);
    border: 1px solid var(--bs-border-color);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    font-weight: 500;
}
.nav-pills .nav-link:hover {
    background-color: var(--bs-tertiary-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}
.nav-pills .nav-link.active {
    background-color: var(--brand-primary);
    color: white;
    border-color: var(--brand-primary);
    box-shadow: 0 4px 12px rgba(23, 58, 99, 0.3);
    transform: scale(1.05);
}

.search-input {
    transition: box-shadow 0.3s ease;
}
.search-input:focus {
    box-shadow: 0 0.5rem 1rem rgba(23, 58, 99, 0.15)!important;
}

.btn-outline-navy {
    color: #173a63;
    border-color: #173a63;
    transition: all 0.3s ease;
}
.btn-outline-navy:hover {
    background-color: #173a63;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(23, 58, 99, 0.2);
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
.list-move {
  transition: transform 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page Load Animations */
.fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Hide Scrollbar */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
