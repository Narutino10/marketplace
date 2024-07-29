<template>
  <div class="reset-password-container">
    <h2 class="reset-password-title">Reset Password</h2>

    <form @submit.prevent="resetPassword" class="reset-password-form">
      <div class="form-group">
        <label for="password" class="form-label">New Password:</label>
        <input v-model="password" id="password" type="password" class="form-control" required />
        <span v-if="!isPasswordValid" class="text-danger">
          Le mot de passe doit contenir au moins 12 caractères avec au moins une lettre minuscule, une lettre majuscule, un chiffre et un symbole.
        </span>
      </div>
      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirm Password:</label>
        <input v-model="confirmPassword" id="confirmPassword" type="password" class="form-control" required />
        <span v-if="password !== confirmPassword" class="text-danger">
          Les mots de passe ne correspondent pas.
        </span>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="!isFormValid">Reset Password</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const password = ref('');
const confirmPassword = ref('');

const isPasswordValid = computed(() => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  return regex.test(password.value);
});

const isFormValid = computed(() => {
  return password.value && confirmPassword.value && isPasswordValid.value && password.value === confirmPassword.value;
});

async function resetPassword() {
  if (password.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas.');
    return;
  }

  let resetToken = route.params.resetToken;
  if (Array.isArray(resetToken)) {
    resetToken = resetToken[0];
  }

  if (!resetToken) {
    alert('Token invalide ou manquant.');
    return;
  }

  try {
    console.log("Sending reset request for new password");
    await authStore.resetPassword(resetToken, password.value, confirmPassword.value);
    alert('Mot de passe réinitialisé avec succès');
    router.push('/login');
  } catch (error) {
    console.error("Password reset failed:", error);
    alert('Échec de la réinitialisation du mot de passe. Veuillez réessayer.');
  }
}
</script>

<style scoped>
.reset-password-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 40px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reset-password-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
  font-weight: bold;
}

.reset-password-form {
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
