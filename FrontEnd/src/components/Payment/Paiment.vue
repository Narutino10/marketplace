<template>
  <section class="payment">
    <div class="container">
      <h2>Payment</h2>
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div class="order-line-item">
          <span>Subtotal:</span>
          <span>${{ cartStore.calculateTotals().subtotal }}</span>
        </div>
        <div class="order-line-item">
          <span>Shipping:</span>
          <span v-if="shippingMethod === 'standard'">$5.00</span>
          <span v-if="shippingMethod === 'express'">$15.00</span>
          <span v-if="shippingMethod === 'overnight'">$25.00</span>
        </div>
        <div class="order-line-item">
          <span>Total:</span>
          <span v-if="shippingMethod === 'standard'">${{ cartStore.calculateTotals().subtotal + 5 }}</span>
          <span v-if="shippingMethod === 'express'">${{ cartStore.calculateTotals().subtotal + 15 }}</span>
          <span v-if="shippingMethod === 'overnight'">${{ cartStore.calculateTotals().subtotal + 25 }}</span>
        </div>
      </div>
      <form @submit.prevent="completePurchase">
        <div class="form-group">
          <label for="cardNumber">Card Number</label>
          <input type="text" id="cardNumber" v-model="paymentInfo.cardNumber" required />
        </div>
        <div class="form-group">
          <label for="expiryDate">Expiry Date</label>
          <input type="text" id="expiryDate" v-model="paymentInfo.expiryDate" required />
        </div>
        <div class="form-group">
          <label for="cvv">CVV</label>
          <input type="text" id="cvv" v-model="paymentInfo.cvv" required />
        </div>
        <button type="submit">Complete Purchase</button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/panier';

const cartStore = useCartStore();
const router = useRouter();
const shippingMethod = ref(localStorage.getItem('shippingMethod'));

const paymentInfo = ref({
  cardNumber: '',
  expiryDate: '',
  cvv: ''
});

const completePurchase = () => {
  alert('Purchase completed!');
  localStorage.removeItem('shippingInfo');
  localStorage.removeItem('shippingMethod');
  cartStore.clearCart();
  router.push('/');
};
</script>

<style scoped>
</style>
