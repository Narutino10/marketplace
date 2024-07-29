<template>
  <div class="search-results">
    <h1>Résultats de recherche</h1>
    <div v-if="filteredProducts.length > 0">
      <FicheProducts :products="filteredProducts" :isListView="false" />
    </div>
    <div v-else>
      <p>Aucun produit trouvé</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/products';
import FicheProducts from "@/components/UI/FicheProducts.vue";
import type { Product, SearchCriteria } from '@/stores/products';

const route = useRoute();
const productStore = useProductStore();
const filteredProducts = ref<Product[]>([]);

const fetchSearchResults = async () => {
  // Si les produits n'ont pas été chargés, les récupérer d'abord
  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }

  const searchCriteria: SearchCriteria = {
    name: route.query.name as string,
    description: route.query.description as string,
    category: route.query.category as string,
    brand: route.query.brand as string,
    priceMin: route.query.priceMin ? parseFloat(route.query.priceMin as string) : undefined,
    priceMax: route.query.priceMax ? parseFloat(route.query.priceMax as string) : undefined,
    onSale: route.query.onSale ? route.query.onSale === 'true' : undefined,
    inStock: route.query.inStock ? route.query.inStock === 'true' : undefined,
  };

  productStore.searchFacetedProducts(searchCriteria);
  filteredProducts.value = productStore.products;
};

onMounted(fetchSearchResults);
watch(() => route.query, fetchSearchResults);
</script>

<style scoped>
.search-results {
  padding: 20px;
}
</style>
