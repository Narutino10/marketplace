<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label for="firstName">First Name</label>
      <input v-model="formData.firstName" type="text" id="firstName" class="form-control"/>
    </div>
    <div class="form-group">
      <label for="lastName">Last Name</label>
      <input v-model="formData.lastName" type="text" id="lastName" class="form-control"/>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input v-model="formData.email" type="email" id="email" class="form-control"/>
    </div>
    <div class="form-group">
      <label for="role">Role</label>
      <input v-model="formData.role" type="text" id="role" class="form-control"/>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input v-model="formData.password" type="password" id="password" class="form-control"/>
    </div>
    <button type="submit" class="btn btn-primary">{{ isEdit ? 'Update' : 'Add' }} User</button>
  </form>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, computed } from 'vue';
import axiosInstance from '@/services/api';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['user-added', 'user-updated']);

const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
});

watch(
    () => props.initialData,
    (newValue) => {
      Object.assign(formData, newValue);
    },
    { immediate: true }
);

const isEdit = computed(() => !!props.initialData.id);

const handleSubmit = async () => {
  try {
    if (isEdit.value) {
      await axiosInstance.patch(`/auth/user/${props.initialData.id}`, formData);
      emit('user-updated');
    } else {
      await axiosInstance.post('/auth/register', formData);
      emit('user-added');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-control {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
}
</style>
