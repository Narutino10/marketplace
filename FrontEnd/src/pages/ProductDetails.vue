<template>
  <BarreDeRecherche @search="searchProducts" />

  <section class="product-details">
    <div class="product-container" v-if="product">
      <div class="image-section">
        <img :src="getImage(product)" :alt="product.name" class="main-image" />
        <div class="thumbnail-images">
          <img v-for="image in product.images" :src="getImage({ images: [image] })" :key="image" :alt="product.name" class="thumbnail-image">
        </div>
      </div>
      <div class="details-section">
        <h2>{{ product.name }}</h2>
        <span class="price">{{ product.price.toFixed(2) }}€</span>
        <p class="description">{{ product.description }}</p>
        <p class="brand">by {{ product.brand }}</p>
        <div class="size-options" v-if="product.category === 'vêtements'">
          <span>Size</span>
          <div class="sizes">
            <button v-for="size in sizes" :key="size" @click="selectSize(size)" :class="{ selected: size === selectedSize }">{{ size }}</button>
          </div>
        </div>
        <div class="quantity-section">
          <span>Quantity</span>
          <div class="quantity-controls">
            <button @click="decreaseQuantity">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQuantity">+</button>
          </div>
        </div>
        <button @click="addToCart(product)" class="add-to-cart-button">Add to Cart</button>
        <p class="availability">Availability: {{ product.status === 'available' ? 'In Stock' : 'Out of Stock' }}</p>
        <p class="shipping">Free standard shipping | Free returns</p>
      </div>
    </div>
  </section>

  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/panier';
import { useProductStore } from '@/stores/products';
import type { Product } from '@/stores/products';
import { decodeBase64 } from '@/utils/encodage';
import defaultImage from "@/assets/ui_assets/image1.png";
import BarreDeRecherche from "@/components/UI/SearchBar.vue";
import Footer from "@/components/UI/Footer.vue";

interface ProductWithQuantity extends Product {
  quantity: number;
}

const route = useRoute();
const encodedProductId = route.params.id as string;
const productId = decodeBase64(encodedProductId); // Décodage de l'ID
const product = ref<Product | null>(null);
const productStore = useProductStore();
const cartStore = useCartStore();

const sizes = ref(['S', 'M', 'L']);
const selectedSize = ref('M');
const quantity = ref(1);

const fetchProductById = async (id: string) => {
  product.value = await productStore.getProductById(id);
  console.log(product.value);
};

onMounted(async () => {
  await fetchProductById(productId);
});

const addToCart = (product: Product) => {
  cartStore.addToCart(product, quantity.value);
};

const getImage = (product: { images: string[] }) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return defaultImage;
};

const selectSize = (size: string) => {
  selectedSize.value = size;
};

const increaseQuantity = () => {
  quantity.value++;
};

const decreaseQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

const searchProducts = (query: string) => {
  productStore.searchProducts(query);
};
</script>

<style scoped>
.product-details {
  padding: 20px;
  background-color: #f9f9f9;
}

.product-container {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  margin: auto;
  gap: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-image {
  width: 100%;
  max-width: 400px;
  height: auto;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-bottom: 10px;
}

.thumbnail-images {
  display: flex;
  gap: 10px;
}

.thumbnail-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s;
}

.thumbnail-image:hover {
  transform: scale(1.1);
}

.details-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.details-section h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.price {
  font-size: 24px;
  color: #23a6f0;
  margin-bottom: 20px;
  display: block;
}

.description {
  font-size: 16px;
  margin-bottom: 20px;
}

.brand {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
}

.size-options {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.size-options span {
  font-weight: 700;
  margin-bottom: 10px;
}

.sizes {
  display: flex;
  gap: 10px;
}

.sizes button {
  border: 1px solid #ddd;
  padding: 10px;
  background: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sizes button.selected {
  background-color: #23a6f0;
  color: white;
}

.sizes button:hover {
  background-color: #f0f0f0;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.quantity-section span {
  font-weight: 700;
  margin-bottom: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  border: 1px solid #ddd;
  padding: 10px;
  background: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.quantity-controls button:hover {
  background-color: #f0f0f0;
}

.quantity-controls span {
  font-size: 16px;
}

.add-to-cart-button {
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 15px 30px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  text-align: center;
}

.add-to-cart-button:hover {
  background-color: #1d94d2;
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
    align-items: center;
  }

  .details-section {
    align-items: center;
    text-align: center;
  }

  .size-options, .quantity-section {
    align-items: center;
  }
}
</style>
