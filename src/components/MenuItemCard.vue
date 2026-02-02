<template>
  <div class="card h-100 shadow-sm border-0 overflow-hidden item-card">
    <div class="position-relative overflow-hidden group">
       <img 
         :src="imageSrc" 
         class="card-img-top object-fit-cover transition-transform" 
         :class="{'cursor-pointer': item.expandable}"
         :alt="item.name" 
         style="height: 200px; width: 100%;"
         @click="handleImageClick"
         @error="handleImageError"
       >
       <button v-if="item.expandable" 
            class="position-absolute bottom-0 end-0 p-2 text-white bg-dark bg-opacity-50 rounded-top-start border-0 expand-icon"
            aria-label="Expand image"
            @click.stop="handleImageClick">
         <i class="bi bi-arrows-fullscreen"></i>
       </button>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
        <div>
            <h5 class="card-title text-navy mb-1 fw-bold">{{ item.name }}</h5>
            <!-- Badges -->
            <div v-if="item.badges && item.badges.length" class="d-flex gap-1 flex-wrap">
                <span v-for="badge in item.badges" :key="badge" 
                      class="badge bg-warning text-dark px-2 py-1 rounded-pill" 
                      style="font-size: 0.65rem; text-transform: uppercase;">
                    {{ badge }}
                </span>
            </div>
        </div>
        <span class="badge bg-red fs-6 shadow-sm text-nowrap">{{ formattedPrice }}</span>
      </div>
      <p class="card-text text-muted small flex-grow-1" style="line-height: 1.5;">{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['preview']);

// Currency & Price
const formattedPrice = computed(() => {
    // Default to GH₵ if currency is missing or use item.currency
    const currency = props.item.currency || 'GH₵';
    return `${currency}${props.item.price.toFixed(2)}`;
});

// Image Handling
const imageSrc = ref(props.item.image);
const placeholder = '/images/placeholder-food.svg'; // Default fallback

const handleImageError = () => {
  imageSrc.value = placeholder;
};

// Update image if prop changes
watch(() => props.item.image, (newVal) => {
  imageSrc.value = newVal;
});

const handleImageClick = () => {
  if (props.item.expandable) {
    emit('preview', props.item);
  }
};
</script>

<style scoped>
.item-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}

.transition-transform {
    transition: transform 0.5s ease;
}

.item-card:hover .transition-transform {
    transform: scale(1.05);
}

.cursor-pointer {
    cursor: pointer;
}

.expand-icon {
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.item-card:hover .expand-icon {
  opacity: 1;
}
</style>
