<template>
  <div class="home-container">
    <!--<NavigationBar @openAuthModal="openAuthModal" />-->
    <AuthModal :isVisible="isAuthModalVisible" @close="closeAuthModal" />

    <section class="hero-section">
      <div class="hero-content">
        <span class="hero-text">We know how large objects will act, but things on a small scale just do not act that way.</span>
        <button class="start-button">Start now</button>
      </div>
    </section>

    <section class="products-section">
      <div class="product-card" v-for="(product, index) in products" :key="index">
        <div class="product-text">
          <span class="product-tag">{{ product.tag }}</span>
          <h1 class="product-title">{{ product.title }}</h1>
          <span class="product-cta">{{ product.cta }}</span>
        </div>
        <img :src="product.image" :alt="product.title" />
      </div>
    </section>

    <section class="best-sellers-section">
      <div class="best-sellers-container">
        <div class="featured-item">
          <img src="../assets/ui_assets/card_items.jpg" alt="Featured item" />
        </div>
        <div class="best-sellers-list">
          <BestSellers_Products />
        </div>
      </div>
    </section>

    <section class="newsletter-section">
      <div class="newsletter-content">
        <h2 class="newsletter-title">Subscribe to Our Newsletter</h2>
        <p class="newsletter-description">Stay updated with our latest products and offers</p>
        <form class="newsletter-form">
          <input type="email" placeholder="Enter your email" required>
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavigationBar from "@/components/UI/NavigationBar.vue";
import Footer from "@/components/UI/Footer.vue";
import BestSellers_Products from "@/components/UI/BestSellers_Products.vue";
import AuthModal from '@/components/common/AuthModal.vue';

const isAuthModalVisible = ref(false);

function openAuthModal() {
  isAuthModalVisible.value = true;
}

function closeAuthModal() {
  isAuthModalVisible.value = false;
}

const products = [
  {
    tag: "Your Space",
    title: "Unique Life",
    cta: "Explore Items",
    image: new URL('../assets/ui_assets/image2.png', import.meta.url).href
  },
  {
    tag: "Ends Today",
    title: "Elements Style",
    cta: "Explore Items",
    image: new URL('../assets/ui_assets/image1.png', import.meta.url).href
  },
  {
    tag: "Your Space",
    title: "Unique Life",
    cta: "Explore Items",
    image: new URL('../assets/ui_assets/image3.png', import.meta.url).href
  }
];
</script>

<style scoped>
.home-container {
  width: 100%;
}

.hero-section {
  background-image: url('../assets/ui_assets/dumbels.jpg');
  background-size: cover;
  background-position: center;
  min-height: 40vw;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero-content {
  width: 32%;
}

.hero-text {
  color: #23a6f0;
  font-size: 18px;
  display: block;
  margin-bottom: 20px;
}

.start-button {
  background-color: rgba(35, 166, 240, 1);
  padding: 12px;
  border: none;
  color: white;
  border-radius: 3px;
  width: 36%;
  font-size: 16px;
  cursor: pointer;
}

.products-section {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 61px;
  background: #80808012;
  justify-content: space-between;
  max-width:105rem ;
}

.product-card {
  background-color: white;
  display: flex;
  padding: 14px;
  justify-content: center;
  box-shadow: inset 0 0 1em rgb(255 255 255), 0 0 1em rgb(160 148 148 / 33%);
}

.product-card img {
  width: 244px;
  height: 181px;
  object-fit: cover;
}

.product-text {
  display: flex;
  flex-direction: column;
  margin: auto;
  text-align: center;
}

.product-title {
  color: black;
  margin: 10px 0;
}

.product-tag, .product-cta {
  color: #808080ad;
}

.best-sellers-section {
  padding: 40px 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.best-sellers-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.featured-item {
  flex: 1;
  min-width: 300px;
  max-width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.featured-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-item:hover img {
  transform: scale(1.05);
}

.best-sellers-list {
  flex: 2;
  min-width: 300px;
}

@media (max-width: 768px) {
  .best-sellers-container {
    flex-direction: column;
  }

  .featured-item,
  .best-sellers-list {
    width: 100%;
  }
}

.newsletter-section {
  background-color: #f8f8f8;
  padding: 40px 0;
  text-align: center;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.newsletter-description {
  color: #666;
  margin-bottom: 20px;
}

.newsletter-form {
  display: flex;
  justify-content: center;
}

.newsletter-form input {
  padding: 10px;
  width: 60%;
  border: 1px solid #ddd;
  border-radius: 3px 0 0 3px;
}

.newsletter-form button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
}
</style>
