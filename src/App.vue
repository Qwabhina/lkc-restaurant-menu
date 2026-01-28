<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Navbar -->
    <header class="bg-navy text-white shadow sticky-top" style="z-index: 100;">
      <div class="container py-2 position-relative d-flex justify-content-center align-items-center">
        <!-- Centered Logo -->
        <router-link to="/" class="d-flex align-items-center justify-content-center text-decoration-none text-white logo-hover">
            <div class="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm" style="width: 60px; height: 60px;">
                <img src="/images/logo-light-bg.png" alt="Lancaster Logo" class="img-fluid" style="max-height: 100%; max-width: 100%;">
            </div>
        </router-link>

        <!-- Theme Toggle (Absolute Right) -->
        <button 
            @click="toggleTheme" 
            class="btn btn-link text-white position-absolute end-0 me-0 me-md-3 rounded-circle d-flex align-items-center justify-content-center theme-toggle"
            style="width: 40px; height: 40px; background: rgba(255,255,255,0.1);"
            aria-label="Toggle theme"
        >
            <i class="bi" :class="isDark ? 'bi-sun-fill' : 'bi-moon-stars-fill'"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow-1">
        <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-navy text-white py-5 mt-auto">
        <div class="container">
            <div class="row gy-4">
                <div class="col-md-6 text-center text-md-start">
                    <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
                        <img src="/images/logo-dark-bg.png" alt="Lancaster Logo" style="height: 40px; filter: brightness(0) invert(1);">
                        <h5 class="fw-bold mb-0">Lancaster Kumasi City</h5>
                    </div>
                    <p class="text-white-50 small mb-0">Experience luxury and taste in the heart of Kumasi.</p>
                </div>
                <div class="col-md-6 text-center text-md-end">
                    <p class="mb-2">Open Daily: 11:00 AM - 10:30 PM</p>
                    <div class="d-flex justify-content-center justify-content-md-end gap-3">
                        <a href="#" class="text-white"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="text-white"><i class="bi bi-instagram"></i></a>
                        <a href="#" class="text-white"><i class="bi bi-twitter"></i></a>
                    </div>
                </div>
            </div>
            <hr class="border-secondary my-4 opacity-25">
            <div class="text-center">
                <p class="mb-0 small opacity-50">&copy; 2026 Lancaster Kumasi City. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scroll to Top Button -->
    <transition name="fade">
      <button 
        v-if="showScrollTop" 
        @click="scrollToTop" 
        class="btn btn-red rounded-circle shadow-lg position-fixed bottom-0 end-0 m-4 d-flex align-items-center justify-content-center"
        style="width: 50px; height: 50px; z-index: 1000;"
        aria-label="Scroll to top"
      >
        <i class="bi bi-arrow-up text-white fs-4"></i>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Scroll Logic
const showScrollTop = ref(false);

const checkScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Theme Logic
const isDark = ref(false);

const toggleTheme = () => {
    isDark.value = !isDark.value;
    const theme = isDark.value ? 'dark' : 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
};

onMounted(() => {
    window.addEventListener('scroll', checkScroll);

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDark.value = true;
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    }
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
.letter-spacing-1 {
    letter-spacing: 1px;
}

.logo-hover div {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-hover:hover div {
    transform: scale(1.1);
}

.theme-toggle {
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    background: rgba(255,255,255,0.2) !important;
    transform: rotate(15deg);
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
