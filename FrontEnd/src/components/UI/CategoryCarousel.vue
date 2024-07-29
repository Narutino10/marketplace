<template>
  <div class="category-carousel">
    <button @click="prevCategory" class="carousel-button left">‹</button>
    <div class="carousel">
      <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)` }">
        <div v-for="category in categories" :key="category" class="category-item" @click="$emit('select-category', category)">
          <div>
            <span>{{ category.toUpperCase() }}</span>
          </div>
        </div>
      </div>
    </div>
    <button @click="nextCategory" class="carousel-button right">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  categories: string[]
}>();

const currentSlide = ref(0);
const visibleSlides = ref(3);

const nextCategory = () => {
  if (currentSlide.value < props.categories.length - visibleSlides.value) {
    currentSlide.value++;
  }
};

const prevCategory = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};
</script>

<style scoped>
.category-carousel {
  display: flex;
  align-items: center;
  position: relative;
  width: 82%;
  padding: 36px;
  margin: auto;
}

.carousel {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.carousel-button.left {
  left: 0;
}

.carousel-button.right {
  right: 0;
}

.category-item {
  height: 206px;
  background-size: cover;
  background-position: center;
  min-width: calc(100% / 3);
  margin: 0 5px;
  position: relative;
  cursor: pointer;
}

.category-item div {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.category-item span {
  color: white;
  font-weight: 600;
  font-size: medium;
}
</style>
