<template>
  <nav class="navbar">
    <div class="title">
      <router-link class="navbar-brand" to="/home">MAMBAFIT</router-link>
    </div>

    <button class="navbar-toggle" @click="toggleMobileMenu">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <div :class="['links', { 'mobile-menu': isMobileMenuOpen }]">
      <li class="nav-item"><router-link class="nav-link" to="/home">Home</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/products">All Products</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/products">Sports</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/about">Femme</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/blog">Homme</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/contact">Equipement</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/contact">Nutrition et Santé</router-link></li>
      <li class="nav-item"><router-link class="nav-link" to="/contact">Soldes et santé</router-link></li>
    </div>

    <ul :class="['linkTwo', { 'mobile-menu': isMobileMenuOpen }]">
      <li v-if="!isAuthenticated" class="nav-item">
        <a class="nav-link2" href="#" @click.prevent="openAuthModal">Login</a>
      </li>
      <li v-else class="nav-item profile-menu">
        <img src="@/assets/ui_assets/user.svg" alt="profile" @click="toggleMenu" />
        <ul v-if="showMenu" class="profile-dropdown">
          <li><router-link to="/profile">Profile</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin/dashboard">Dashboard</router-link></li>
          <li><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </li>
      <li class="nav-item cart-icon">
        <router-link class="nav-link2" to="/cart">
          <img src="../../assets/ui_assets/Panier.svg" alt="cart">
          <span class="cart-count" v-if="cartCount > 0">{{ cartCount }}</span>
        </router-link>
      </li>
      <li class="nav-item"><router-link class="nav-link2" to="/wishlist"><img src="../../assets/ui_assets/hart.svg" alt="wishlist"></router-link></li>
    </ul>
  </nav>
</template>

<script setup>
import {ref, computed, watchEffect} from 'vue';
import {useAuthStore} from '@/stores/user';
import {useAuthModalStore} from '@/stores/authModale';
import {useCartStore} from '@/stores/panier';

const authModalStore = useAuthModalStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const isAdmin = computed(() => authStore.user && authStore.user.role === 'admin');
const cartCount = computed(() => cartStore.items.reduce((total, item) => total + item.quantity, 0));

const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const logout = () => {
  authStore.logout();
};

const openAuthModal = () => {
  authModalStore.openModal();
};

watchEffect(() => {
  console.log('Auth state changed, isAuthenticated:', isAuthenticated.value);
  console.log('User role:', authStore.user ? authStore.user.role : 'No user');
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: white;
  padding: 19px;
  color: black;
}

.title {
  font-size: 20px;
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.navbar-toggle svg {
  width: 24px;
  height: 24px;
}

.links, .linkTwo {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.links li, .linkTwo li {
  margin-left: 18px;
}

.title a {
  color: rgba(37, 43, 66, 1);
  font-weight: 700;
}

.links li a {
  color: rgba(115, 115, 115, 1);
  text-decoration: none;
}

.linkTwo li a {
  color: #23a6f0;
  font-weight: 500;
  text-decoration: none;
}

.profile-menu {
  position: relative;
}

.profile-menu img {
  width: 20px;
  height: 20px;
}

.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px;
  border-radius: 4px;
  width: 150px;
}

.profile-dropdown li {
  padding: 10px;
}

.profile-dropdown li a {
  color: black;
  text-decoration: none;
}

.profile-dropdown li a:hover {
  text-decoration: underline;
}

.cart-icon {
  position: relative;
}

.cart-icon .cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  color: black; /* Changed from white to black */
  font-size: 12px;
}

@media (max-width: 768px) {
  .navbar {
    flex-wrap: wrap;
    justify-content: center;
  }

  .navbar-toggle {
    display: block;
  }

  .links, .linkTwo {
    display: none;
    flex-direction: column;
    width: 100%;
    text-align: center;
  }

  .mobile-menu {
    display: flex;
  }

  .links li, .linkTwo li {
    margin: 10px 0;
    width: 100%;
  }

  .links li a, .linkTwo li a {
    width: 100%;
    padding: 10px 0;
  }
}
</style>
