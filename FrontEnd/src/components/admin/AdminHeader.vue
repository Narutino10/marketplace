<template>
  <header class="admin-header">
    <div class="header-left">
      <span class="title">Admin Dashboard</span>
    </div>
    <div class="header-right">
      <input type="text" placeholder="Search..." class="search-bar" />
      <img src="@/assets/ui_assets/user.svg" alt="User" class="user-icon" @click="toggleMenu" />
      <ul v-if="showMenu" class="profile-dropdown">
        <li><router-link to="/profile">Profile</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin/dashboard">Dashboard</router-link></li>
        <li><a href="#" @click.prevent="logout">Logout</a></li>
      </ul>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const isAdmin = computed(() => authStore.user && authStore.user.role === 'admin');

const showMenu = ref(false);
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const logout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
};
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left .title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.search-bar {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

.user-icon {
  height: 40px;
  cursor: pointer;
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
</style>
