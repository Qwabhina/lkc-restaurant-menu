<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="image-preview-overlay" @click="close">
        <button class="btn-close btn-close-white position-absolute top-0 end-0 m-4 fs-4" @click.stop="close"></button>
        
        <Transition name="zoom">
          <div v-if="show" class="preview-container" @click.stop>
            <img :src="imageSrc" :alt="altText" class="img-fluid rounded shadow-lg preview-image">
            <div class="text-center mt-3" v-if="caption">
                <h5 class="text-white mb-1">{{ caption }}</h5>
                <p class="text-white-50 mb-0" v-if="price">{{ price }}</p>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  imageSrc: String,
  altText: String,
  caption: String,
  price: String
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1050; /* Bootstrap modal z-index */
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.preview-container {
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-image {
  max-height: 80vh;
  object-fit: contain;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.zoom-enter-from,
.zoom-leave-to {
  transform: scale(0.8);
}
</style>
