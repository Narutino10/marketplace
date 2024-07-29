<template>
  <div class="checkout-page">
      <div class="titles">
          <h2>Your checkout</h2>
          <span>Not ready to checkout? Continue Shopping</span>
      </div>
      <section class="checkout-container">
          <div class="checkout-form">
              <div class="steps">
                  <span>Address</span>
                  <span>Shipping</span>
                  <span class="active-step">Payment</span>
              </div>

              <div class="payment-methods">
                  <button type="button" @click="selectPaymentMethod('paypal')" :class="{ active: selectedPaymentMethod === 'paypal' }">PayPal</button>
                  <button type="button" @click="selectPaymentMethod('card')" :class="{ active: selectedPaymentMethod === 'card' }">Credit Card</button>
              </div>

              <form @submit.prevent="selectedPaymentMethod === 'card' ? handleCardSubmit() : handlePaypalCheckout()">
                  <div v-if="selectedPaymentMethod === 'card'" class="payment-details">
                      <label for="card-name">Cardholder Name</label>
                      <input type="text" id="card-name" v-model="cardName" required />

                      <label for="card-element">Card Details</label>
                      <div id="card-element">
                          <!-- Stripe Card Element will be inserted here -->
                      </div>

                      <label class="save-card">
                          <input type="checkbox" v-model="saveCard" /> Save card data for future payments
                      </label>

                      <div id="card-error" class="error-message">{{ error }}</div>

                      <button type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay with card' }}</button>
                  </div>

                  <button v-if="selectedPaymentMethod === 'paypal'" type="submit" :disabled="loading">{{ loading ? 'Processing...' : 'Pay with PayPal' }}</button>
              </form>
          </div>

          <div class="cart-summary">
              <h3>Your cart</h3>
              <div v-for="item in cartItems" :key="item._id" class="cart-item">
                  <div class="item-details">
                      <h4>{{ item.name }}</h4>
                      <p>Size: {{ item.size }}</p>
                      <p>Quantity: {{ item.quantity }}</p>
                      <p>${{ item.price }}</p>
                      <button @click="removeItem(item._id)">Remove</button>
                  </div>
              </div>
          </div>
      </section>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
// import { useCartStore } from '@/stores/cart'; // Comment this out for now
import { usePaymentStore } from '@/stores/payment';
import Footer from "../components/UI/Footer.vue";

// const cartStore = useCartStore(); // Comment this out for now
// const cartItems = computed(() => cartStore.cartItems); // Comment this out for now

// Mock cart items for display purposes
const cartItems = ref([
  { _id: 'mock1', name: 'Test Product 1', quantity: 1, price: 10 },
  { _id: 'mock2', name: 'Test Product 2', quantity: 2, price: 20 }
]);

const paymentStore = usePaymentStore();
const selectedPaymentMethod = ref('card');
const cardName = ref('');
const saveCard = ref(false);

const loading = computed(() => paymentStore.loading);
const error = computed(() => paymentStore.error);

const selectPaymentMethod = (method: string) => {
  selectedPaymentMethod.value = method;
};

const handleCardSubmit = async () => {
  await paymentStore.handleCardPayment(cardName.value);
};

const handlePaypalCheckout = async () => {
  await paymentStore.handlePaypalCheckout(cardName.value);
};

const removeItem = (itemId: string) => {
  cartItems.value = cartItems.value.filter(item => item._id !== itemId);
  // cartStore.removeFromCart(itemId); // Comment this out for now
};

onMounted(async () => {
  await paymentStore.initializeStripe();
});
</script>

<style scoped>
/* Add your styles here */
</style>


  
  


  <style scoped>
  .checkout-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #f8f8f8;
    min-height: 100vh;
    color: black;
  }
  
  .checkout-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
  }
  
  .checkout-form {
    width: 60%;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-right: 20px;
    color:#000;

  }
  
  .steps {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
    font-size: 1.2rem;
  }
  
  .steps .active-step {
    font-weight: bold;
  }
  
  .payment-methods {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  .payment-methods button {
    margin: 0 10px;
    padding: 10px 20px;
    border: 1px solid #ccc;
    background: none;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .payment-methods .active {
    background-color: #000;
    color: #fff;
  }
  
  .payment-details label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .payment-details input,
  .payment-details select {
    width: 100%;
    padding: 10px;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .card-details {
    display: flex;
    justify-content: space-between;
  }
  
  .card-details > div {
    width: 32%;
  }
  
  .save-card {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  .save-card input {
    margin-right: 0.5rem;
  }
  
  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    background-color: #000;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    border-radius: 4px;
    width: 100%;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  
  .cart-summary {
    width: 35%;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .cart-item {
    display: flex;
    margin-bottom: 1rem;
  }
  
  .cart-item img {
    width: 50px;
    height: 50px;
    margin-right: 1rem;
  }
  
  .item-details {
    display: flex;
    flex-direction: column;
  }
  </style>
  