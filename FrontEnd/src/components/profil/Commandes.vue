<template>
  <div class="orders-section">
    <h2>Mes Commandes</h2>
    <div v-if="isLoading" class="loading">Chargement...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="!isLoading && orders.length === 0" class="no-orders">Vous n'avez pas encore passé de commande.</div>
    <div v-if="!isLoading && orders.length > 0" class="orders-grid">
      <div v-for="order in paginatedOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Commande #{{ order.id }}</h3>
          <p class="order-date">{{ formatDate(order.dateOrder) }}</p>
        </div>
        <p class="order-amount">Montant : {{ order.totalAmount.toFixed(2) }}€</p>
        <button @click="viewOrderDetails(order.id)">Voir les détails</button>
      </div>
    </div>
    <button v-if="showLoadMoreButton" @click="loadMoreOrders" class="load-more-button">Afficher plus</button>

    <Modal v-model="showOrderDetailsModal" :title="`Order ID: ${selectedOrder?.id}`">
      <div class="order-details-modal">
        <div class="info-section">
          <h3 class="order-details-title">Order Details</h3>
          <p><strong>Date:</strong> {{ selectedOrder?.dateOrder }}</p>
          <p><strong>Status:</strong> {{ selectedOrder?.statusOrder }}</p>
          <p><strong>Total Amount:</strong> {{ selectedOrder?.totalAmount }}</p>
          <p><strong>Products:</strong></p>
          <table class="product-table">
            <thead>
            <tr>
              <th>Product Name</th>
              <th>Unit Price</th>
              <th>Quantity</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="product in selectedOrder?.OrderDetails" :key="product.productName">
              <td>{{ product.productName }}</td>
              <td>{{ product.unitPrice }}</td>
              <td>{{ product.quantity }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useOrderStore } from '@/stores/Commande';
import { useAuthStore } from "@/stores/user";
import Modal from '@/components/common/Modale.vue';

interface Order {
  id: number;
  dateOrder: string;
  statusOrder: string;
  totalAmount: number;
  OrderDetails: {
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  userId: number;
}

const orders = ref<Order[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const showOrderDetailsModal = ref(false);
const selectedOrder = ref<Partial<Order> | null>(null);
const orderStore = useOrderStore();
const authStore = useAuthStore();

const userId = ref<number | null>(authStore.user?.id || null);
const ordersPerPage = 10;
const currentPage = ref(1);

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  return orders.value.slice(start, end);
});

const showLoadMoreButton = computed(() => orders.value.length > currentPage.value * ordersPerPage);

const loadMoreOrders = () => {
  currentPage.value += 1;
};

const fetchUserOrders = async () => {
  if (!userId.value) {
    error.value = 'User ID not available';
    return;
  }

  console.log(userId);

  isLoading.value = true;
  error.value = null;
  try {
    await orderStore.getOrderByUserId(userId.value);
    orders.value = orderStore.orders;
  } catch {
    error.value = 'Échec de la récupération des commandes';
  } finally {
    isLoading.value = false;
  }
};

const viewOrderDetails = async (orderId: number) => {
  try {
    isLoading.value = true;
    error.value = null;
    console.log(orderId);
    const order = await orderStore.fetchOrderById(orderId);
    if (order) {
      selectedOrder.value = order;
      showOrderDetailsModal.value = true;
    } else {
      error.value = `Commande avec l'ID ${orderId} non trouvée`;
    }
  } catch {
    error.value = `Échec de la récupération des détails de la commande ${orderId}`;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};

// Utiliser watch après avoir défini toutes les fonctions nécessaires
watch(() => authStore.user, (newUser) => {
  if (newUser?.id) {
    userId.value = newUser.id;
    fetchUserOrders();
  } else {
    error.value = 'User ID not available';
  }
}, { immediate: true });
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.orders-section {
  padding: 20px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.orders-section h2 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  color: #333;
}

.orders-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.order-card {
  width: calc(50% - 20px);
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-card h3 {
  font-size: 20px;
  font-family: 'Montserrat', sans-serif;
}

.order-date {
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  color: #555;
}

.order-amount {
  margin: 5px 0;
  font-family: 'Montserrat', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #000;
}

.order-card button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  transition: background-color 0.3s;
  align-self: flex-end;
}

.order-card button:hover {
  background-color: #218838;
}

.load-more-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.load-more-button:hover {
  background-color: #0056b3;
}

.loading, .error, .no-orders {
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
}

.order-details-modal {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.info-section {
  flex: 2;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.order-details-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.order-details-modal p {
  margin: 10px 0;
  color: #333;
}

.order-details-modal strong {
  color: #555;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.product-table th {
  background-color: #f2f2f2;
  color: #333;
}

.product-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.product-table tr:hover {
  background-color: #ddd;
}
</style>
