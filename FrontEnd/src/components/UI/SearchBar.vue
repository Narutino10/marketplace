<template>
  <div class="barre-de-recherche">
    <div class="breadcrumb">
      <a href="#">Accueil</a>
      <img src="@/assets/ui_assets/Fleche.svg" alt="breadcrumb separator">
      <a href="#">Boutique</a>
    </div>
    <div class="search-bar">
      <input type="text" v-model="searchQuery.name" placeholder="Rechercher des produits..." />
      <button @click="executeSearch">Rechercher</button>
      <button @click="toggleAdvancedSearch" class="advanced-search-button">
        {{ showAdvancedSearch ? 'Cacher' : 'Plus de critères' }}
      </button>
    </div>
    <div v-if="showAdvancedSearch" class="advanced-search">
      <input type="text" v-model="searchQuery.description" placeholder="Description du produit..." />
      <input type="text" v-model="searchQuery.category" placeholder="Catégorie du produit..." />
      <input type="text" v-model="searchQuery.brand" placeholder="Marque du produit..." />
      <input type="number" v-model="searchQuery.priceMin" placeholder="Prix min..." />
      <input type="number" v-model="searchQuery.priceMax" placeholder="Prix max..." />
      <label>
        <input type="checkbox" v-model="searchQuery.onSale" />
        En promotion
      </label>
      <label>
        <input type="checkbox" v-model="searchQuery.inStock" />
        En stock
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { SearchCriteria } from '@/stores/products';

const searchQuery = ref<SearchCriteria>({
  name: '',
  description: '',
  category: '',
  brand: '',
  priceMin: undefined,
  priceMax: undefined,
  onSale: undefined,
  inStock: undefined,
});

const showAdvancedSearch = ref(false);

const router = useRouter();

const buildSearchURL = () => {
  const params: Record<string, any> = {};

  if (searchQuery.value.name) params.name = searchQuery.value.name;
  if (searchQuery.value.description) params.description = searchQuery.value.description;
  if (searchQuery.value.category) params.category = searchQuery.value.category;
  if (searchQuery.value.brand) params.brand = searchQuery.value.brand;
  if (searchQuery.value.priceMin !== undefined) params.priceMin = searchQuery.value.priceMin;
  if (searchQuery.value.priceMax !== undefined) params.priceMax = searchQuery.value.priceMax;
  if (searchQuery.value.onSale !== undefined) params.onSale = searchQuery.value.onSale;
  if (searchQuery.value.inStock !== undefined) params.inStock = searchQuery.value.inStock;

  return { path: '/search', query: params };
};

const executeSearch = () => {
  const searchURL = buildSearchURL();
  router.push(searchURL);
};

const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.barre-de-recherche {
  padding: 20px 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 16px auto;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  font-family: 'Montserrat', sans-serif;
}

.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb a {
  margin-left: 12px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #23a6f0;
}

.breadcrumb img {
  margin: 0 8px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #23a6f0;
}

.search-bar button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #1d94d2;
}

.advanced-search-button {
  background-color: transparent;
  color: #23a6f0;
  border: 1px solid #23a6f0;
  border-radius: 4px;
}

.advanced-search-button:hover {
  background-color: #23a6f0;
  color: white;
}

.advanced-search {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.advanced-search input, .advanced-search label {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.3s;
}

.advanced-search input:focus {
  border-color: #23a6f0;
}
</style>
