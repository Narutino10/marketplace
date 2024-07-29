<template>
  <section class="cart">
    <div class="cart-content">
      <div class="cart-items">
        <div class="title">Your cart</div>
        <div class="not-ready-to">Not ready to checkout? Continue Shopping</div>
        <div class="separator"></div>

        <div v-for="(product, index) in cartStore.items" :key="index" class="horizontal-product-card">
          <img :src="getImage(product)" :alt="product.name" class="product-image"/>
          <div class="title-parent">
            <div class="title2">{{ product.name }}</div>
            <div v-if="product.size" class="size-l">Size: {{ product.size }}</div>
            <div class="brand" v-if="product.brand">Brand: {{ product.brand }}</div>
            <div class="size-l">
              Quantity:
              <button @click="updateQuantity(index, product.quantity - 1)">-</button>
              {{ product.quantity }}
              <button @click="updateQuantity(index, product.quantity + 1)">+</button>
            </div>
            <div class="price">${{ product.price }}</div>
          </div>
          <div class="remove-button" @click="removeItem(index)">Remove</div>
        </div>
      </div>

      <div class="order-summary">
        <div class="title1">Order Summary</div>

        <div class="order-information">
          <div class="title4">
            <div class="title5">Order Information</div>
            <div class="title-child"></div>
          </div>
          <div class="simple-accordion" v-for="info in orderInformation" :key="info.title">
            <div class="title-container">
              <div class="title6">{{ info.title }}</div>
              <div class="icon"></div>
            </div>
            <div class="title7">{{ info.description }}</div>
            <div class="simple-accordion-child"></div>
          </div>
        </div>

        <div class="input">
          <div class="rectangle"></div>
          <div class="input-name">Enter coupon code here</div>
        </div>

        <div class="line-items">
          <div class="order-line-item">
            <div class="subtotal">Subtotal</div>
            <div class="amount">${{ cartStore.calculateTotals().subtotal }}</div>
          </div>
          <div class="order-line-item">
            <div class="subtotal">Shipping</div>
            <div class="amount">Calculated at the next step</div>
          </div>
          <div class="line-items-child"></div>
          <div class="order-line-item">
            <div class="subtotal">Total</div>
            <div class="amount">${{ cartStore.calculateTotals().total }}</div>
          </div>
        </div>

        <div class="default">
          <div class="button" @click="checkout">
            <div class="base"></div>
            <div class="button-text">Continue to checkout</div>
          </div>
        </div>
      </div>
    </div>

    <div class="cart-footer">
      <div class="newsletter">
        <div class="title10">Sign up for our newsletter</div>
        <div class="email-input">
          <div class="rectangle"></div>
          <div class="input-name">Email Address</div>
        </div>
        <b class="sign-up">Sign Up</b>
        <div class="be-the-first">Be the first to know about our special offers, news, and updates.</div>
      </div>
      <div class="copyrights-sitecom-all">Copyrights site.com. All Rights Reserved</div>
    </div>

    <Modal v-if="showErrorModal" v-model="showErrorModal" title="Error">
      <div class="error-modal">
        <p>Your cart is empty. Please add products to your cart before proceeding.</p>
        <button @click="closeErrorModal">OK</button>
      </div>
    </Modal>
  </section>
  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/panier';
import { useOrderStore } from '@/stores/Commande';
import { useRouter } from 'vue-router';
import defaultImage from "@/assets/ui_assets/image1.png";
import Modal from '@/components/common/Modale.vue';

const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();
const showErrorModal = ref(false);

const orderInformation = ref([
  {
    title: 'Return Policy',
    description: 'This is our example return policy which is everything you need to know about our returns.'
  },
  { title: 'Shipping Options', description: 'Various shipping options are available for your convenience.' }
]);

const getImage = (product) => {
  if (product.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return defaultImage;
};

const checkout = async () => {
  if (cartStore.items.length === 0) {
    showErrorModal.value = true;
    return;
  }

  try {
    const { subtotal } = cartStore.calculateTotals();
    const userId = cartStore.isAuthenticated ? cartStore.authStore.user.id : null;
    const products = cartStore.items.map(item => ({
      productId: item._id,
      quantity: item.quantity
    }));

    const response = await orderStore.createOrder({
      userId,
      statusOrder: 'Pending Validation',
      totalAmount: subtotal,
      products
    });

    const orderId = response;
    console.log(orderId);
    console.log(response);

    cartStore.clearCart();
    router.push({ path: '/checkout', query: { orderId } });
  } catch (error) {
    console.error('Failed to create order and continue to checkout:', error);
  }
};

const removeItem = (index) => {
  cartStore.removeFromCart(index);
};

const updateQuantity = (index, quantity) => {
  cartStore.updateCartItemQuantity(index, quantity);
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};

onMounted(() => {
  cartStore.loadCart();
});
</script>

<style scoped>
body {
  font-family: 'Public Sans', sans-serif;
}

.cart {
  padding: 20px;
  background-color: #eff2f6;
  width: 100%;
  height: 100%;
}

.cart-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.cart-header, .cart-footer {
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
}

.title {
  font-size: 36px;
  font-weight: 600;
  margin: 20px 0;
}

.title1 {
  font-size: 22px;
  font-weight: 600;
  margin: 10px 0;
}

.not-ready-to {
  font-size: 16px;
  font-weight: 500;
  margin: 10px 0;
}

.separator {
  width: 100%;
  border-top: 1px solid #909090;
  margin: 20px 0;
}

.cart-items {
  flex: 3;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.horizontal-product-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}

.product-image {
  width: 129px;
  height: 133px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.title-parent {
  flex: 1;
  padding: 6px 5px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.title2 {
  font-size: 22px;
  font-weight: 600;
}

.size-l, .price {
  font-size: 14px;
  font-weight: 400;
}

.brand {
  font-size: 14px;
  font-weight: 400;
}

.price {
  font-size: 22px;
  font-weight: 600;
}

.remove-button {
  text-decoration: underline;
  cursor: pointer;
}

.order-summary {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 300px;
}

.order-information {
  margin: 20px 0;
}

.title4 {
  position: relative;
}

.title5 {
  font-size: 22px;
  font-weight: 600;
}

.title-child {
  width: 100%;
  border-top: 1px solid #000;
  margin-top: 10px;
}

.simple-accordion {
  margin-bottom: 10px;
}

.title-container {
  position: relative;
}

.title6 {
  font-size: 16px;
  font-weight: 600;
  color: #909090;
}

.icon {
  width: 13px;
  height: 13px;
  background: #909090;
  position: absolute;
  top: 4px;
  right: 0;
}

.title7 {
  font-size: 16px;
  font-weight: 400;
  color: #909090;
  margin: 10px 0;
}

.simple-accordion-child {
  width: 100%;
  border-top: 1px solid #909090;
}

.input {
  position: relative;
  margin: 20px 0;
}

.input .rectangle {
  border: 0.5px solid #000;
  height: 40px;
}

.input .input-name {
  position: absolute;
  top: 10px;
  left: 15px;
  color: #a9abbd;
  font-size: 14px;
  font-weight: 400;
}

.line-items {
  margin: 20px 0;
}

.order-line-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.subtotal, .amount {
  font-size: 14px;
  font-weight: 400;
}

.amount {
  text-align: right;
}

.line-items-child {
  width: 100%;
  border-top: 1px solid #000;
}

.default {
  text-align: center;
  margin: 20px 0;
}

.button {
  background-color: #0d0d0d;
  color: white;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
}

.button:hover {
  background-color: #333;
}

.newsletter {
  margin-top: 20px;
  text-align: center;
  width: 100%;
}

.newsletter .title10 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.newsletter .email-input {
  position: relative;
  margin-bottom: 10px;
}

.newsletter .email-input .rectangle {
  border: 1px solid #000;
  height: 40px;
}

.newsletter .email-input .input-name {
  position: absolute;
  top: 10px;
  left: 15px;
  color: #a9abbd;
  font-size: 14px;
  font-weight: 400;
}

.sign-up {
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.be-the-first {
  font-size: 14px;
  font-weight: 400;
  color: #a9abbd;
  margin-top: 10px;
}

.copyrights-sitecom-all {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #a9abbd;
}

@media (max-width: 1200px) {
  .cart-content {
    flex-direction: column;
  }

  .order-summary {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .horizontal-product-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .product-image {
    width: 100%;
    max-width: 300px;
  }

  .title-parent {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 28px;
  }

  .title1 {
    font-size: 18px;
  }

  .title2 {
    font-size: 20px;
  }

  .price {
    font-size: 18px;
  }

  .remove-button {
    font-size: 12px;
  }
}
</style>
