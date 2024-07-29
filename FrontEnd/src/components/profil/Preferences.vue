<template>
  <div class="preferences-section">
    <h2>Préférences</h2>
    <form @submit.prevent="updatePreferences">
      <div>
        <label for="newsletter">Abonnement à la newsletter</label>
        <input type="checkbox" id="newsletter" v-model="preferences.newsletter" />
      </div>
      <div>
        <label for="sms-notifications">Notifications par SMS</label>
        <input type="checkbox" id="sms-notifications" v-model="preferences.smsNotifications" />
      </div>
      <button type="submit">Mettre à jour</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const preferences = ref({
  newsletter: false,
  smsNotifications: false,
});

const updatePreferences = () => {
};
</script>

<style scoped>
.preferences-section {
  max-width: 600px;
  margin: auto;
}

.preferences-section form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preferences-section label {
  font-weight: bold;
}

.preferences-section input[type="checkbox"] {
  margin-right: 10px;
}

.preferences-section button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.preferences-section button:hover {
  background-color: #1d94d2;
}
</style>
