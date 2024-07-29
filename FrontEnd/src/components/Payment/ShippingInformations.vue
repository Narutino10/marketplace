<template>
  <section class="shipping-info">
    <div class="container">
      <h2>Shipping Information</h2>
      <form @submit.prevent="nextStep">
        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="shippingInfo.address" required />
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" v-model="shippingInfo.city" required />
        </div>
        <div class="form-group">
          <label for="postalCode">Postal Code</label>
          <input type="text" id="postalCode" v-model="shippingInfo.postalCode" required />
        </div>
        <div class="form-group">
          <label for="country">Country</label>
          <input type="text" id="country" v-model="shippingInfo.country" required />
        </div>
        <button type="submit">Continue to Shipping Options</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/user';
import { useAddressStore } from '@/stores/Addresses';
import { defineEmits } from 'vue';

const emit = defineEmits(['next-step']);

const authStore = useAuthStore();
const addressStore = useAddressStore();

const shippingInfo = ref({
  address: '',
  city: '',
  postalCode: '',
  country: ''
});

const router = useRouter();

const nextStep = async () => {
  if (authStore.isAuthenticated) {
    const userId = authStore.user?.id;
    if (userId) {
      await addressStore.createAddress({
        address: shippingInfo.value.address,
        city: shippingInfo.value.city,
        postalcode: shippingInfo.value.postalCode,
        country: shippingInfo.value.country,
        userid: userId
      });
      emit('next-step', 'ShippingOptions');
    } else {
      console.error('User ID is missing');
    }
  } else {
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo.value));
    emit('next-step', 'ShippingOptions');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.shipping-info {
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
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
