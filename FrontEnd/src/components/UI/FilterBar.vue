<template>
  <div class="filter-bar">
    <div class="showing">
      <span>Showing all {{ totalResults }} results</span>
    </div>
    <div class="views">
      <span>Views:</span>
      <img src="@/assets/ui_assets/carre.svg" alt="Grid View" @click="$emit('change-view', 'list')">
      <img src="@/assets/ui_assets/liste.svg" alt="List View" @click="$emit('change-view', 'grid')">
    </div>
    <div class="sort-and-filter">
      <div class="dropdown">
        <select v-model="selectedSort" @change="handleSortChange">
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      <button class="filter-button" @click="handleFilterClick">Filter</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  totalResults: number,
  initialSort: string
}>();

const emit = defineEmits(['change-view', 'sort', 'filter']);

const selectedSort = ref(props.initialSort);

const handleSortChange = () => {
  emit('sort', selectedSort.value);
};

const handleFilterClick = () => {
  emit('filter');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 195px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ececec;
  font-family: 'Montserrat', sans-serif;
}

.showing {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #737373;
}

.views {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #737373;
}

.views img {
  width: 24px;
  height: 24px;
  margin: 0 5px;
  cursor: pointer;
}

.sort-and-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort select {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #737373;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.filter-button {
  padding: 8px 16px;
  border-radius: 5px;
  background-color: #23a6f0;
  color: white;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  border: none;
  cursor: pointer;
}

.filter-button:hover {
  background-color: #1d94d2;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .showing, .views, .sort-and-filter {
    justify-content: flex-start;
    margin-top: 10px;
  }
}
</style>
