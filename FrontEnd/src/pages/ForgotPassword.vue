<template>
  <div class="forgot-password-container">
    <h2 class="forgot-password-title">Forgot Password</h2>

    <form @submit.prevent="requestReset" class="forgot-password-form">
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input v-model="email" id="email" type="email" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Request Reset</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/user';

const email = ref('');
const authStore = useAuthStore();

async function requestReset() {
  try {
    console.log("Sending reset request for:", email.value);
    await authStore.requestPasswordReset(email.value);
    alert('Password reset email sent');
  } catch (error) {
    console.error("Reset request failed:", error);
    alert('Failed to send reset email. Please check the email address.');
  }
}
</script>

<style scoped>
.forgot-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.forgot-password-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.forgot-password-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  width: 100%;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
}

.btn {
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
