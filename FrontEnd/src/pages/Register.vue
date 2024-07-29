<template>
  <div class="register-container">
    <h2 class="register-title">Register</h2>
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="role" class="form-label">Role:</label>
        <select v-model="form.role" id="role" class="form-control" required>
          <option value="" disabled>Select a role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
      </div>
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input v-model="form.email" id="email" type="email" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="firstName" class="form-label">First Name:</label>
        <input v-model="form.firstName" id="firstName" type="text" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="lastName" class="form-label">Last Name:</label>
        <input v-model="form.lastName" id="lastName" type="text" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input v-model="form.password" id="password" type="password" class="form-control" required />
        <span v-if="!isPasswordValid" class="text-danger">Le mot de passe doit contenir au moins 12 caractères avec au moins une lettre minuscule, une lettre majuscule, un chiffre et un symbole.</span>
      </div>
      <div class="form-group">
        <label for="password_confirm" class="form-label">Confirm Password:</label>
        <input v-model="form.password_confirm" id="password_confirm" type="password" class="form-control" required />
        <span v-if="form.password !== form.password_confirm" class="text-danger">Les mots de passe ne correspondent pas.</span>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="!isFormValid">Register</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axiosInstance from '@/services/api';
import router from "@/router/router";
import { useAuthStore } from '@/stores/user';
const userStore = useAuthStore();


const form = ref({
  role: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  password_confirm: ''
});

const isPasswordValid = computed(() => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return regex.test(form.value.password);
});

const isFormValid = computed(() => {
  return form.value.role && form.value.email && form.value.firstName && form.value.lastName && form.value.password && form.value.password_confirm && isPasswordValid.value && form.value.password === form.value.password_confirm;
});

async function handleSubmit() {
  try {
    console.log("Form data:", form.value);
    const response = await userStore.register(form.value);
    alert(`User registered successfully! Response:\n${JSON.stringify(response)}`);
    console.log(response);
    router.push(`/${response.user.role}/login`);
  } catch (error: any) {
    console.log("Form data on error:", form.value);
    console.error("Error during registration:", error);
    alert(error.response?.data?.message || 'An error occurred');
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #555;
}

.form-control {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
  color: black;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.text-danger {
  color: red;
  font-size: 14px;
}
</style>
