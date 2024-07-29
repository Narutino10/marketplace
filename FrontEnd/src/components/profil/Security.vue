<template>
  <div class="security-section">
    <h2>Sécurité</h2>
    <form @submit.prevent="updatePassword">
      <div>
        <label for="current-password">Mot de passe actuel</label>
        <input type="password" id="current-password" v-model="currentPassword" />
      </div>
      <div>
        <label for="new-password">Nouveau mot de passe</label>
        <input type="password" id="new-password" v-model="newPassword" />
      </div>
      <div>
        <label for="confirm-password">Confirmer le mot de passe</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" />
      </div>
      <button type="submit">Mettre à jour le mot de passe</button>
    </form>
    <div class="two-factor-auth">
      <h3>Double Authentification</h3>
      <button @click="toggleTwoFactorAuth">{{ twoFactorEnabled ? 'Désactiver' : 'Activer' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/user';

const authStore = useAuthStore();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const twoFactorEnabled = ref(false);

const updatePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }
  authStore.updatePassword(currentPassword.value, newPassword.value);
};

const toggleTwoFactorAuth = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value;
  // Logique pour activer/désactiver la double authentification
};
</script>

<style scoped>
.security-section {
  max-width: 600px;
  margin: auto;
}

.security-section form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.security-section label {
  font-weight: bold;
}

.security-section input[type="password"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.security-section button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.security-section button:hover {
  background-color: #1d94d2;
}

.two-factor-auth {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.two-factor-auth h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.two-factor-auth button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.two-factor-auth button:hover {
  background-color: #1d94d2;
}
</style>
