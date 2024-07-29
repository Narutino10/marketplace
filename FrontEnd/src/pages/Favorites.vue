<template>
  <section>
    <div class="titles">
      <h1>Favorites</h1>
    </div>
    <div class="buttonShopAll">
      <button>Shop All</button>
    </div>
    <div class="lesproduits">
      <div v-for="product in favoriteProducts" :key="product.id" class="produit">
        <img class="productImage" :src="product.imageUrl" alt="">
        <div class="productinfos">
          <span>{{ product.name }}</span>
          <!--<img src="/src/assets/Heart.pn" alt="">-->
        </div>
        <div class="price">
          <span>{{ product.price }}</span>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';
import axiosInstance from "@/services/api";
//import NavigationBar from "../components/UI/NavigationBar.vue";
import Footer from "../components/UI/Footer.vue";

const favoriteProducts = ref([]);
const authStore = useAuthStore();

const fetchFavorites = async () => {
  try {
    if (!authStore.isAuthenticated) {
      throw new Error("User is not authenticated");
    }
    const response = await axiosInstance.get(`/favorites/${authStore.user.id}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    });
    favoriteProducts.value = response.data;
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
};

onMounted(() => {
  fetchFavorites();
});

</script>

<style scoped>
section {
  padding: 18px;
}

div.titles {
  text-align: center;
}

div.buttonShopAll {
  text-align: center;
  margin: 23px;
}

div.buttonShopAll button {
  border: 1px solid black;
  padding: 9px;
  width: 10%;
  background: whitesmoke;
}

div.lesproduits {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

div.produit {
  width: 20%;
  margin-left: 4px;
  padding: 17px;
}

.productImage {
  width: -webkit-fill-available;
  margin: auto;
  height: auto;
}

div.productinfos {
  display: flex;
}

div.productinfos span {}

div.productinfos img {
  width: 16px;
  height: 16px;
  margin-left: auto;
}

div.price {}

div.price span {}
</style>