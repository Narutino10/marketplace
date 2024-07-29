<template>
  <div class="checkout-container">
    <div class="checkout-content">
      <div class="steps-container">
        <component :is="steps[currentStep]" @next-step="handleNextStep"></component>
      </div>
      <div class="cart-summary">
        <h2>Your Order</h2>
        <div v-for="item in displayedItems" :key="item.productId" class="cart-item">
          <img :src="getImage(item)" :alt="item.productName" class="cart-item-image" />
          <div class="cart-item-details">
            <p class="item-name">{{ item.productName }}</p>
            <p class="item-quantity">Quantity: {{ item.quantity }}</p>
            <p class="item-price">{{ item.unitPrice.toFixed(2) }}€</p>
          </div>
        </div>
        <div class="cart-total">
          <p>Total: {{ calculateTotal() }}€</p>
        </div>
      </div>
    </div>
    <Modal v-if="showErrorModal" v-model="showErrorModal" title="Error">
      <div class="error-modal">
        <p>Your cart is empty. Please add products to your cart before proceeding.</p>
        <button @click="closeErrorModal">OK</button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ShippingInformations from "@/components/Payment/ShippingInformations.vue";
import ShippingOptions from '@/components/Payment/ShippingOptions.vue';
import Payment from '@/components/Payment/Paiment.vue';
import { useOrderStore } from '@/stores/Commande';
import { useRouter } from 'vue-router';
import defaultImage from "@/assets/ui_assets/image1.png";
import Modal from '@/components/common/Modale.vue';

const steps = {
  ShippingInformations,
  ShippingOptions,
  Payment
};

const currentStep = ref('ShippingInformations');
const showErrorModal = ref(false);

const orderStore = useOrderStore();
const router = useRouter();
const displayedItems = ref([]);

const handleNextStep = (nextStep) => {
  currentStep.value = nextStep;
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

const getImage = (product) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return defaultImage;
};

const calculateTotal = () => {
  return displayedItems.value.reduce((total, item) => total + item.unitPrice * item.quantity, 0).toFixed(2);
};

onMounted(async () => {
  const orderId = router.currentRoute.value.query.orderId;
  console.log(orderId);
  if (orderId) {
    const order = await orderStore.fetchOrderById(orderId);
    if (order) {
      displayedItems.value = order.OrderDetails;
    }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.checkout-container {
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.checkout-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  gap: 20px;
}

.steps-container {
  flex: 2;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cart-summary {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.cart-summary h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-right: 20px;
}

.cart-item-details {
  flex: 1;
}

.item-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
}

.item-quantity,
.item-price {
  font-size: 16px;
  margin-bottom: 5px;
  font-family: 'Montserrat', sans-serif;
}

.cart-total {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
  text-align: right;
}

.error-modal {
  text-align: center;
  padding: 20px;
}

.error-modal p {
  margin-bottom: 20px;
}

.error-modal button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  font-family: 'Montserrat', sans-serif;
}

.error-modal button:hover {
  background-color: #0056b3;
}

@media (min-width: 768px) {
  .checkout-content {
    flex-direction: row;
  }
}
</style>