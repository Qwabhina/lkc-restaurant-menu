<template>
  <div class="landing-page container py-5">
    <div class="text-center mb-5 fade-in-up">
      <h1 class="display-4 fw-bold text-navy mb-2">Adinkra Restaurant</h1>
      <p class="h5 text-muted mb-4">Lancaster Kumasi City</p>
      <p class="lead text-muted mx-auto" style="max-width: 600px;">
        Choose from our exquisite selection of dining options.
      </p>
    </div>

    <div class="row g-4 justify-content-center">
      <!-- A La Carte -->
      <div class="col-md-4 fade-in-up" style="animation-delay: 0.1s;">
        <router-link :to="{ name: 'Menu', params: { section: 'food' }}" class="card text-decoration-none border-0 shadow-lg h-100 section-card">
          <div class="card-img-wrapper position-relative overflow-hidden">
            <div class="overlay d-flex align-items-center justify-content-center bg-navy bg-opacity-75">
                <i class="bi bi-egg-fried text-white display-1"></i>
            </div>
            <!-- Placeholder for section image if we had one -->
          </div>
          <div class="card-body text-center py-4 rounded-bottom">
            <h3 class="fw-bold text-navy mb-2">À La Carte</h3>
            <p class="text-muted small mb-0">Starters, Mains, Grill & Desserts</p>
            <div class="mt-3">
                <span class="btn btn-outline-navy rounded-pill px-4">View Menu</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Beverages -->
      <div class="col-md-4 fade-in-up" style="animation-delay: 0.2s;">
        <router-link :to="{ name: 'Menu', params: { section: 'beverages' }}" class="card text-decoration-none border-0 shadow-lg h-100 section-card">
          <div class="card-img-wrapper position-relative overflow-hidden">
             <div class="overlay d-flex align-items-center justify-content-center bg-red bg-opacity-75">
                <i class="bi bi-cup-straw text-white display-1"></i>
            </div>
          </div>
          <div class="card-body text-center py-4 rounded-bottom">
            <h3 class="fw-bold text-navy mb-2">Beverages</h3>
            <p class="text-muted small mb-0">Soft Drinks, Wines & Spirits</p>
            <div class="mt-3">
                <span class="btn btn-outline-navy rounded-pill px-4">View Menu</span>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Cocktails -->
      <div class="col-md-4 fade-in-up" style="animation-delay: 0.3s;">
        <router-link :to="{ name: 'Menu', params: { section: 'cocktails' }}" class="card text-decoration-none border-0 shadow-lg h-100 section-card">
          <div class="card-img-wrapper position-relative overflow-hidden">
             <div class="overlay d-flex align-items-center justify-content-center bg-navy bg-opacity-75">
                <i class="bi bi-tropical-storm text-white display-1"></i>
            </div>
          </div>
          <div class="card-body text-center py-4 rounded-bottom">
            <h3 class="fw-bold text-navy mb-2">Cocktails</h3>
            <p class="text-muted small mb-0">Signature Cocktails & Mocktails</p>
            <div class="mt-3">
                <span class="btn btn-outline-navy rounded-pill px-4">View Menu</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card-img-wrapper {
    height: 250px;
    background-color: #f0f0f0;
}
.overlay {
    width: 100%;
    height: 100%;
}

.section-card {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.section-card:hover {
    transform: translateY(-10px);
}
.section-card:hover .btn-outline-navy {
    background-color: var(--brand-primary);
    color: white;
}

/* Animations */
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
</style>
