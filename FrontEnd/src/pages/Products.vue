<template>
  <BreadcrumbWithSearch @search="filterProducts" />
  <section>
    <CategoryCarousel :categories="categories" @select-category="filterByCategory" />
    <div class="product-section">
      <FilterBar
          :totalResults="filteredProducts.length"
          :initialSort="selectedSort"
          @change-view="changeView"
          @sort="updateSort"
          @filter="filterProducts"
      />
      <div :class="['product-list', { 'list-view': isListView, 'grid-view': !isListView }]">
        <FicheProducts :products="filteredProducts" :isListView="isListView" />
      </div>
      <Footer />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/products';
import BreadcrumbWithSearch from "../components/UI/SearchBar.vue";
import CategoryCarousel from "../components/UI/CategoryCarousel.vue";
import FilterBar from "../components/UI/FilterBar.vue";
import FicheProducts from "../components/UI/FicheProducts.vue";
import Footer from "@/components/UI/Footer.vue";
import type { Product, SearchCriteria } from '@/stores/products';

const productStore = useProductStore();
const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const searchQuery = ref<string>('');
const selectedCategory = ref<string | null>(null);
const selectedSort = ref<string>('popularity');
const error = ref<string | null>(null);
const isLoading = ref(false);
const isListView = ref(true);
const route = useRoute();

const categories = computed(() => {
  const uniqueCategories = new Set(products.value.map(product => product.category));
  return Array.from(uniqueCategories);
});

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    await productStore.fetchProducts();
    products.value = productStore.products;
    filteredProducts.value = products.value;
  } catch (err) {
    error.value = 'Error fetching products';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProducts);

const changeView = (view: string) => {
  isListView.value = view === 'list';
};

const filterProducts = (query?: string) => {
  if (query !== undefined) {
    searchQuery.value = query;
  }

  let filtered = products.value;

  const criteria: SearchCriteria = {
    name: route.query.name as string,
    description: route.query.description as string,
    category: route.query.category as string,
    brand: route.query.brand as string,
    priceMin: route.query.priceMin ? parseFloat(route.query.priceMin as string) : undefined,
    priceMax: route.query.priceMax ? parseFloat(route.query.priceMax as string) : undefined,
    onSale: route.query.onSale ? route.query.onSale === 'true' : undefined,
    inStock: route.query.inStock ? route.query.inStock === 'true' : undefined,
  };

  if (criteria.name) {
    filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(criteria.name!.toLowerCase())
    );
  }

  if (criteria.description) {
    filtered = filtered.filter(product =>
        product.description.toLowerCase().includes(criteria.description!.toLowerCase())
    );
  }

  if (criteria.category) {
    filtered = filtered.filter(product =>
        product.category.toLowerCase().includes(criteria.category!.toLowerCase())
    );
  }

  if (criteria.brand) {
    filtered = filtered.filter(product =>
        product.brand.toLowerCase().includes(criteria.brand!.toLowerCase())
    );
  }

  if (criteria.priceMin !== undefined) {
    filtered = filtered.filter(product => product.price >= criteria.priceMin!);
  }

  if (criteria.priceMax !== undefined) {
    filtered = filtered.filter(product => product.price <= criteria.priceMax!);
  }

  if (criteria.onSale !== undefined) {
    filtered = filtered.filter(product => product.status === 'sale');
  }

  if (criteria.inStock !== undefined) {
    filtered = filtered.filter(product => product.stock_available > 0);
  }

  sortProducts();
  filteredProducts.value = filtered;
};

const filterByCategory = (category: string) => {
  selectedCategory.value = category;
  filterProducts();
};

const sortProducts = () => {
  filteredProducts.value.sort((a, b) => {
    switch (selectedSort.value) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });
};

const updateSort = (sortValue: string) => {
  selectedSort.value = sortValue;
  filterProducts();
};

// Watch for changes in route query parameters and filter products
watch(() => route.query, () => filterProducts(), { deep: true });
</script>

<style scoped>
.product-section {
  padding: 20px;
}

.product-list {
  display: grid;
  gap: 20px;
  padding: 0 20px;
}

.product-list.list-view {
  grid-template-columns: repeat(1, 1fr); /* Un produit par ligne pour la vue liste */
}

.product-list.grid-view {
  grid-template-columns: repeat(4, 1fr); /* Quatre produits par ligne pour la vue grille */
}

@media (max-width: 768px) {
  .product-list.grid-view {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
