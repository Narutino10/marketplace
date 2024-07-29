<template>
  <div class="profile-page">
    <aside class="sidebar">
      <nav class="sidebar-menu">
        <ul>
          <li @click="setActiveMenu('profile')" :class="{ 'active': currentTab === 'profile' }">
            <a href="#">
              <i class="fas fa-user"></i>
              <span>Mon Profil</span>
            </a>
          </li>
          <li @click="setActiveMenu('orders')" :class="{ 'active': currentTab === 'orders' }">
            <a href="#">
              <i class="fas fa-shopping-cart"></i>
              <span>Mes Commandes</span>
            </a>
          </li>
          <li @click="setActiveMenu('payment-methods')" :class="{ 'active': currentTab === 'payment-methods' }">
            <a href="#">
              <i class="fas fa-credit-card"></i>
              <span>Mes Méthodes de Paiement</span>
            </a>
          </li>
          <li @click="setActiveMenu('addresses')" :class="{ 'active': currentTab === 'addresses' }">
            <a href="#">
              <i class="fas fa-map-marker-alt"></i>
              <span>Mes Adresses</span>
            </a>
          </li>
          <li @click="setActiveMenu('security')" :class="{ 'active': currentTab === 'security' }">
            <a href="#">
              <i class="fas fa-lock"></i>
              <span>Sécurité</span>
            </a>
          </li>
          <li @click="setActiveMenu('preferences')" :class="{ 'active': currentTab === 'preferences' }">
            <a href="#">
              <i class="fas fa-cog"></i>
              <span>Préférences</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    <section class="content">
      <component :is="currentComponent" :user="user" :addresses="addresses" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/user';
import Profile from '@/components/profil/Profile.vue';
import Orders from '@/components/profil/Commandes.vue';
import PaymentMethods from '@/components/profil/MéthodesPayment.vue';
import Security from '@/components/profil/Security.vue';
import Addresses from '@/components/profil/Adresses.vue';
import Preferences from '@/components/profil/Preferences.vue';

const currentTab = ref('profile');

const componentsMap = {
  profile: Profile,
  orders: Orders,
  'payment-methods': PaymentMethods,
  addresses: Addresses,
  security: Security,
  preferences: Preferences,
};

const currentComponent = computed(() => componentsMap[currentTab.value]);

const setActiveMenu = (menu: string) => {
  currentTab.value = menu;
};

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const addresses = ref([]);
</script>

<style scoped>
/* Your styles here */
</style>


<style scoped>
.profile-page {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #f4f6f8;
  color: #333;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu ul {
  padding: 0;
}

.sidebar-menu li {
  padding: 15px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s, transform 0.3s;
}

.sidebar-menu li a {
  display: flex;
  align-items: center;
  width: 100%;
  color: #333;
  text-decoration: none;
}

.sidebar-menu li:hover,
.sidebar-menu li.active {
  background-color: #e8e8e8;
  transform: translateX(5px);
}

.sidebar-menu li i {
  margin-right: 10px;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}
</style>
