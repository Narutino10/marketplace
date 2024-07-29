<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <!--<div class="pro-sidebar-logo">
        <div>A</div>
        <h5>Admin Dashboard</h5>
      </div>-->
    </div>
    <nav class="sidebar-menu">
      <ul>
        <li @click="setActiveMenu('dashboard')" :class="{ 'active': activeMenu === 'dashboard' }">
          <a href="#">
            <i class="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
        </li>
        <li @click="setActiveMenu('orders')" :class="{ 'active': activeMenu === 'orders' }">
          <a href="#">
            <i class="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </a>
        </li>
        <li @click="setActiveMenu('products')" :class="{ 'active': activeMenu === 'products' }">
          <a href="#">
            <i class="fas fa-box-open"></i>
            <span>Products</span>
          </a>
        </li>
        <li @click="setActiveMenu('users')" :class="{ 'active': activeMenu === 'customers' }">
          <a href="#">
            <i class="fa fa-users"></i>
            <span>Customers</span>
          </a>
        </li>
        <li @click="setActiveMenu('list')" :class="{ 'active': activeMenu === 'list' }">
          <a href="#">
            <i class="fas fa-chart-line"></i>
            <span>Analytics</span>
          </a>
        </li>
        <li @click="setActiveMenu('settings')" :class="{ 'active': activeMenu === 'settings' }">
          <a href="#">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </a>
        </li>
        <hr class="menu-separator">
        <li @click="home">
          <a href="#">
            <i class="fas fa-globe"></i>
            <span>My Website</span>
          </a>
        </li>
        <li @click="logout">
          <a href="#">
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>


<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  activeMenu: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:activeMenu']);

const authStore = useAuthStore();
const router = useRouter();

const setActiveMenu = (menu: string) => {
  emit('update:activeMenu', menu);
};

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
};

const home = async () => {
  router.push('/');
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f4f6f8;
  color: #333;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  position: relative;
  box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
}

.pro-sidebar-logo {
  display: flex;
  align-items: center;
}

.pro-sidebar-logo > div {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: white;
  font-size: 24px;
  font-weight: 700;
  background-color: #4caf50;
  margin-right: 10px;
}

.pro-sidebar-logo > h5 {
  font-size: 20px;
  color: #333;
  font-weight: bold;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu li {
  padding: 10px 20px;
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

.sidebar-menu li:hover {
  background-color: #e8e8e8;
  transform: translateX(5px);
}

.sidebar-menu li.active {
  background-color: #e8e8e8;
}

.sidebar-menu li i {
  margin-right: 15px;
  font-size: 18px;
}

.menu-separator {
  border: 0;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
}
</style>

