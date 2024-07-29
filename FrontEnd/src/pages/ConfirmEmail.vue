<template>
  <div class="confirmation-container">
    <h2 class="confirmation-title">{{ messageTitle }}</h2>
    <p class="confirmation-message">{{ messageContent }}</p>
    <router-link v-if="confirmationSuccess" to="/login" class="btn btn-primary">Se connecter</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/services/api';

const route = useRoute();
const confirmationSuccess = ref(false);
const messageTitle = ref('Confirmation en cours...');
const messageContent = ref('Veuillez patienter pendant que nous confirmons votre email.');

onMounted(async () => {
  const token = route.params.token;
  try {
    const response = await axiosInstance.get(`/auth/confirm-email/${token}`);
    if (response.status === 200) {
      confirmationSuccess.value = true;
      messageTitle.value = 'Inscription Confirmée';
      messageContent.value = 'Votre inscription a été confirmée avec succès. Vous pouvez maintenant vous connecter.';
    } else {
      messageTitle.value = 'Erreur de Confirmation';
      messageContent.value = 'Le lien de confirmation est invalide ou a expiré.';
    }
  } catch (error) {
    messageTitle.value = 'Erreur de Confirmation';
    messageContent.value = 'Le lien de confirmation est invalide ou a expiré.';
  }
});
</script>

<style scoped>
.confirmation-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.confirmation-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.confirmation-message {
  text-align: center;
  margin-bottom: 20px;
  color: #555;
}

.btn {
  display: block;
  width: 100%;
  text-align: center;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 3px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
  border: none;
  text-decoration: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
