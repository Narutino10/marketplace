<template>
  <div class="payment-methods-section">
    <h2>Mes Méthodes de Paiement</h2>
    <div v-for="method in paymentMethods" :key="method.id" class="payment-method-card">
      <p>Type: {{ method.type }}</p>
      <p>Numéro: **** **** **** {{ method.lastFourDigits }}</p>
      <button @click="removePaymentMethod(method.id)">Supprimer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const paymentMethods = ref([
  { id: '1', type: 'Visa', lastFourDigits: '1234' },
  { id: '2', type: 'MasterCard', lastFourDigits: '5678' },
]);

const removePaymentMethod = (methodId: string) => {
};
</script>

<style scoped>
.payment-methods-section {
  max-width: 600px;
  margin: auto;
}

.payment-method-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.payment-method-card p {
  margin: 5px 0;
}

.payment-method-card button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.payment-method-card button:hover {
  background-color: #1d94d2;
}
</style>