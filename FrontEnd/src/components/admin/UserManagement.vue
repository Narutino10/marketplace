<template>
  <div>
    <button class="add-user-button" @click="showUserModal = true">Add User</button>

    <Table
        :items="users"
        :columns="columns"
        :itemsPerPage="10"
        :onView="viewUser"
        :onEdit="editUser"
        :onDelete="deleteUser"
    />

    <Modal v-model="showUserModal" :title="modalTitle">
      <UserForm
          :initialData="selectedUser"
          @user-added="onUserAdded"
          @user-updated="onUserUpdated"
      />
    </Modal>

    <Modal v-if="showUserDetailsModal" v-model="showUserDetailsModal" :title="selectedUser?.firstName + ' ' + selectedUser?.lastName">
      <div class="user-details-modal">
        <div class="info-section">
          <h3 class="user-details-title">{{ selectedUser?.firstName }} {{ selectedUser?.lastName }}</h3>
          <p><strong>Email:</strong> {{ selectedUser?.email }}</p>
          <p><strong>Role:</strong> {{ selectedUser?.role }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/user';
import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import UserForm from '@/components/common/UserForm.vue';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Column<T> {
  key: keyof T & string;
  label: string;
  searchable?: boolean;
}

const authStore = useAuthStore();
const showUserModal = ref(false);
const showUserDetailsModal = ref(false);
const selectedUser = ref<Partial<User> | null>(null);

const users = ref<User[]>([]);
const columns: Column<User>[] = [
  { key: 'firstname', label: 'First Name', searchable: true },
  { key: 'lastname', label: 'Last Name', searchable: true },
  { key: 'email', label: 'Email', searchable: true },
  { key: 'role', label: 'Role' }
];

const modalTitle = computed(() => selectedUser.value ? 'Edit User' : 'Add User');

const fetchUsers = async () => {
  try {
    const fetchedUsers = await authStore.fetchUsers();
    users.value = fetchedUsers;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

onMounted(async () => {
  await fetchUsers();
});

const viewUser = (user: User) => {
  selectedUser.value = { ...user };
  showUserDetailsModal.value = true;
};

const editUser = (user: User) => {
  selectedUser.value = { ...user };
  showUserModal.value = true;
};

const deleteUser = async (user: User) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await authStore.deleteUser(user.id);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
};

const onUserAdded = async () => {
  showUserModal.value = false;
  await fetchUsers();
};

const onUserUpdated = async () => {
  showUserModal.value = false;
  selectedUser.value = null;
  await fetchUsers();
};
</script>

<style scoped>
.add-user-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-user-button:hover {
  background-color: #0056b3;
}

.user-details-modal {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.info-section {
  flex: 2;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.user-details-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.user-details-modal p {
  margin: 10px 0;
  color: #333;
}

.user-details-modal strong {
  color: #555;
}
</style>
