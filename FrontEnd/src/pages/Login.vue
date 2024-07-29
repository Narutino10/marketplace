<template>
  <div class="login-container">
    <h2 class="login-title">Sign In</h2>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input v-model="email" id="email" type="email" class="form-control" required />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input v-model="password" id="password" type="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <div class="forgot-password">
      <router-link to="/forgot-password">Forgot password?</router-link>
    </div>
    <div class="register">
      <router-link to="/register">Don't have an account? Sign up</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "@/router/router";
import { useAuthStore } from "@/stores/user";

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    const response = await authStore.login(email.value, password.value);
    console.log("Connexion réussie :", response);

    if (authStore.user?.role === 'admin') {
      router.push('/admin/dashboard'); // Corrected route path
    } else {
      router.push('/home');
    }

    alert('Connexion réussie');
  } catch (error) {
    console.error("Échec de la connexion :", error);
    alert('Échec de la connexion. Veuillez vérifier vos identifiants.');
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.login-form {
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

.forgot-password,
.register {
  text-align: center;
  margin-top: 15px;
}

.forgot-password a,
.register a {
  color: #007bff;
  text-decoration: none;
}

.forgot-password a:hover,
.register a:hover {
  text-decoration: underline;
}
</style>
