<template>
  <div>
    <div class="Categorie">
      <button @click="slide('left')" class="carousel-button left">‹</button>
      <div class="carousel">
        <ul ref="categoryList" :style="{ transform: `translateX(${-currentIndex * (100 / visibleCategories)}%)` }">
          <li v-for="(category, index) in categories" :key="index">
            <a href="#" @click.prevent="filterByCategory(category)">{{ category }}</a>
          </li>
        </ul>
      </div>
      <button @click="slide('right')" class="carousel-button right">›</button>
    </div>
    <div class="bestProducts">
      <div class="OneProduct" v-for="(product, index) in limitedFilteredProducts" :key="index">
        <img :src="getImage(product)" :alt="product.name" />
        <h2>{{ product.name }}</h2>
        <p>{{ product.category }}</p>
        <div class="prices">
          <span class="priceNormal">${{ product.price.toFixed(2) }}</span>
        </div>
      </div>
    </div>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '@/stores/products';
import defaultImage from '@/assets/ui_assets/image1.png';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  images: string[];
}

const productStore = useProductStore();
const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const categories = ref<string[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentIndex = ref(0);
const visibleCategories = ref(3);

const limitedFilteredProducts = computed(() => filteredProducts.value.slice(0, 6));

onMounted(async () => {
  isLoading.value = true;
  try {
    await productStore.fetchProducts();
    products.value = productStore.products;
    filteredProducts.value = products.value;
    categories.value = [...new Set(products.value.map(product => product.category))];
  } catch (err) {
    error.value = 'Error fetching products';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

const slide = (direction: 'left' | 'right') => {
  const maxIndex = categories.value.length - visibleCategories.value;
  if (direction === 'left' && currentIndex.value > 0) {
    currentIndex.value--;
  } else if (direction === 'right' && currentIndex.value < maxIndex) {
    currentIndex.value++;
  }
};

const filterByCategory = (category: string) => {
  filteredProducts.value = products.value.filter(product => product.category === category);
};

const getImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    const imageUrl = `${baseUrl}/${product.images[0]}`;
    console.log('Image URL:', imageUrl);
    return imageUrl;
  }
  return defaultImage;
};

//console.log(props.products);
</script>

<style scoped>
.Categorie {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  overflow: hidden;
}

.carousel {
  flex: 1;
  overflow: hidden;
}

.Categorie ul {
  display: flex;
  transition: transform 0.3s ease;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.Categorie ul li {
  flex: 0 0 100px;
  text-align: center;
}

.carousel-button {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.bestProducts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 25px;
  width: 100%;
}

.OneProduct {
  text-align: center;
  padding: 17px;
}

.OneProduct img {
  width: 100%;
  max-width: 200px;
  height: 200px;
  object-fit: cover;
}

.OneProduct h2 {
  font-size: 18px;
  margin: 10px 0;
}

.OneProduct p {
  color: grey;
  font-size: 14px;
  margin: 5px 0;
}

.prices {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.priceNormal {
  color: grey;
}

.priceBlue {
  color: rgba(35, 133, 109, 1);
}
</style>
