<template>
  <div class="layout">
    <AdminHeader />
    <div class="layout-content">
      <Sidebar :activeMenu="activeMenu" @update:activeMenu="setActiveMenu" />
      <div class="main-content">
        <div v-if="activeMenu === 'products'" class="dashboard-section">
          <h2>Product Management</h2>
          <ProductManagement />
        </div>
        <div v-else-if="activeMenu === 'users'" class="dashboard-section">
          <h2>User Management</h2>
          <UserManagement />
        </div>
        <div v-else-if="activeMenu === 'orders'" class="dashboard-section">
          <h2>Order Management</h2>
          <OrderManagement />
        </div>

        <div v-else-if="activeMenu === 'list'" class="dashboard-section">
          <h2>List Items</h2>
          <ListItems />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '@/components/common/SideBar.vue';
import AdminHeader from '@/components/admin/AdminHeader.vue';
import ProductManagement from '@/components/admin/ProductManagement.vue';
import UserManagement from '@/components/admin/UserManagement.vue';
import OrderManagement from '@/components/admin/OrderManagement.vue';
import ListItems from '@/components/admin/ListItems.vue';

const activeMenu = ref('products');

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu;
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-content {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.dashboard-section {
  background-color: white;
  padding: 30px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.dashboard-section h2 {
  color: #001529;
  margin-bottom: 20px;
  font-size: 24px;
}
</style>
