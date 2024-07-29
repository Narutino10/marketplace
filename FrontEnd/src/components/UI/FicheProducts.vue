<template>
  <section class="produits">
    <div class="itemsView">
      <div v-for="product in products" :key="product._id" class="productCard">
        <div class="OneProduct">
          <a :href="'/product/' + encodeBase64(product._id)" class="productLink">
            <div class="imageWrapper">
              <img :src="getImage(product)" :alt="product.name" />
              <div class="heartOverlay" @click.stop="toggleFavorite(product)">
                <div class="heartWrapper">
                  <svg
                      @mouseover="hoverHeart = product._id"
                      @mouseleave="hoverHeart = null"
                      :class="['heartIcon', { 'hover': hoverHeart === product._id || isFavorite(product) }]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.01 4.01 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.07C11.46 4.99 12.96 4 14.5 4 16.99 4 19 6.01 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
              </div>
            </div>
          </a>
          <div class="productDetails">
            <a :href="'/product/' + encodeBase64(product._id)" class="productTitleLink">
              <h2>{{ product.name }}</h2>
            </a>
            <p class="category">{{ product.category }}</p>
            <div class="prices">
              <span class="priceNormal">${{ product.price.toFixed(2) }}</span>
            </div>
            <div class="quantity-selector">
              <label for="quantity">Quantity:</label>
              <input type="number" v-model.number="quantities[product._id]" min="1" />
            </div>
            <button class="addToCartButton" @click.stop="addToCart(product)">Ajouter au panier</button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>



<script setup lang="ts">
import { defineProps, ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/panier';
import defaultImage from '@/assets/ui_assets/image1.png';
import type { Product } from "@/stores/products";
import { encodeBase64 } from '@/utils/encodage';


const props = defineProps<{
  products: Product[],
  isListView: boolean
}>();

const getImage = (product: Product) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return defaultImage;
};

const favorites = ref(new Set<string>());
const hoverHeart = ref<string | null>(null);
const cartStore = useCartStore();
const quantities = ref<Record<string, number>>({});

onMounted(() => {
  props.products.forEach(product => {
    if (!quantities.value[product._id]) {
      quantities.value[product._id] = 1;
    }
  });
});

const toggleFavorite = (product: Product) => {
  if (favorites.value.has(product._id)) {
    favorites.value.delete(product._id);
  } else {
    favorites.value.add(product._id);
  }
};

const isFavorite = (product: Product) => {
  return favorites.value.has(product._id);
};

interface ProductWithImageUrl extends Product {
  imageUrl: string;
}

const encodeId = (id: string) => {
  return encodeBase64(id);
};

const addToCart = (product: Product) => {
  const imageUrl = getImage(product);
  const productWithImageUrl: ProductWithImageUrl = { ...product, imageUrl };
  const quantity = quantities.value[product._id] || 1;
  console.log('quantité', quantities.value[product._id]);
  cartStore.addToCart(productWithImageUrl, quantity);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.itemsView {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
}

.productCard {
  position: relative;
}

.productLink {
  text-decoration: none;
  color: inherit;
  display: block;
}

.OneProduct {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  width: 100%;
  position: relative;
}

.OneProduct:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.imageWrapper {
  width: 100%;
  height: 200px; /* Fixed height for the image container */
  position: relative;
}

.imageWrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.heartOverlay {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
}

.heartWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.heartIcon {
  width: 24px;
  height: 24px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.3s;
}

.heartIcon.hover {
  color: red;
}

.productDetails {
  padding: 20px;
  text-align: center;
}

.productDetails h2 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 10px 0;
  font-family: 'Montserrat', sans-serif;
}

.productDetails .category {
  font-size: 16px;
  color: #777;
  margin-bottom: 10px;
}

.prices {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.priceNormal {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.quantity-selector {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-selector label {
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}

.quantity-selector input {
  width: 50px;
  text-align: center;
  font-size: 14px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.addToCartButton {
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.addToCartButton:hover {
  background-color: #1d94d2;
}

@media (max-width: 768px) {
  .itemsView {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .productDetails h2 {
    font-size: 18px;
  }

  .priceNormal {
    font-size: 18px;
  }
}
</style>
