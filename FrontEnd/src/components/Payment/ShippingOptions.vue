<template>
  <section class="options-de-livraison">
    <div class="container">
      <h2>Options de livraison</h2>
      <form @submit.prevent="nextStep">
        <div class="form-group">
          <label for="shippingMethod">Choisissez une méthode de livraison :</label>
          <select id="shippingMethod" v-model="shippingMethod" required>
            <option value="standard">Livraison Standard (5-7 jours) - 5,00€</option>
            <option value="express">Livraison Express (2-3 jours) - 15,00€</option>
            <option value="overnight">Livraison en 24 heures (1 jour) - 25,00€</option>
            <option value="free" v-if="cartTotal > 70">Livraison Gratuite - 0,00€</option>
          </select>
        </div>
        <button type="submit">Continuer vers le paiement</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { defineEmits } from 'vue';
import { useCartStore } from '@/stores/panier';

const emit = defineEmits(['next-step']);
const cartStore = useCartStore();

const shippingMethod = ref('standard');

const cartTotal = computed(() => {
  return cartStore.total;
});

onMounted(() => {
  if (cartTotal.value > 70) {
    shippingMethod.value = 'free';
  }
});

const nextStep = () => {
  localStorage.setItem('shippingMethod', shippingMethod.value);
  emit('next-step', 'Payment');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.options-de-livraison {
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  width: 100%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  color: #555;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  transition: border-color 0.3s;
}

select:focus {
  border-color: #28a745;
  outline: none;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}
</style>