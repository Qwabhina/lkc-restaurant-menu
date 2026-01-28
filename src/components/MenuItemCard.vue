<template>
  <div class="card h-100 shadow-sm border-0 overflow-hidden item-card">
    <div class="position-relative overflow-hidden group">
       <img 
         :src="item.image" 
         class="card-img-top object-fit-cover transition-transform" 
         :class="{'cursor-pointer': item.expandable}"
         alt="Menu Item" 
         style="height: 200px; width: 100%;"
         @click="handleImageClick"
       >
       <div v-if="item.expandable" 
            class="position-absolute bottom-0 end-0 p-2 text-white bg-dark bg-opacity-50 rounded-top-start expand-icon"
            @click.stop="handleImageClick">
         <i class="bi bi-arrows-fullscreen"></i>
       </div>
    </div>
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
        <h5 class="card-title text-navy mb-0 fw-bold">{{ item.name }}</h5>
        <span class="badge bg-red fs-6 shadow-sm text-nowrap">{{ item.currency }}{{ item.price.toFixed(2) }}</span>
      </div>
      <p class="card-text text-muted small flex-grow-1" style="line-height: 1.5;">{{ item.description }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['preview']);

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
