<template>
  <div>
    <button class="add-order-button" @click="handleAddOrderClick">Add Order</button>

    <Table
        :items="orders"
        :columns="columns"
        :itemsPerPage="10"
        @view="viewOrder"
        @edit="editOrder"
        @delete="deleteOrder"
    />

    <Modal v-model="showOrderModal" :title="modalTitle">
      <AddOrderForm
          :initialData="selectedOrder"
          @order-added="onOrderAdded"
          @order-updated="onOrderUpdated"
      />
    </Modal>

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

    <Modal v-if="showErrorModal" v-model="showErrorModal" title="Error">
      <div class="error-modal">
        <p>Your cart is empty. Please add products to your cart before proceeding.</p>
        <button @click="closeErrorModal">OK</button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/Commande';
import { useCartStore } from '@/stores/panier';
import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddOrderForm from '@/components/common/AddOrderForm.vue';

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

interface Column<T> {
  key: keyof T & string;
  label: string;
  formatter?: (value: any) => string;
  searchable?: boolean;
}

const orderStore = useOrderStore();
const cartStore = useCartStore();
const showOrderModal = ref(false);
const showOrderDetailsModal = ref(false);
const showErrorModal = ref(false);
const selectedOrder = ref<Partial<Order> | null>(null);

const orders = computed(() => orderStore.orders);
const modalTitle = computed(() => (selectedOrder.value ? 'Edit Order' : 'Add Order'));

const columns: Column<Order>[] = [
  { key: 'id', label: 'Order ID' },
  { key: 'dateOrder', label: 'Date', searchable: true },
  { key: 'statusOrder', label: 'Status', searchable: true },
  { key: 'totalAmount', label: 'Total Amount' }
];

onMounted(async () => {
  await orderStore.fetchOrders();
});

const handleAddOrderClick = () => {
  if (cartStore.items.length === 0) {
    showErrorModal.value = true;
  } else {
    showOrderModal.value = true;
  }
};

const viewOrder = async (order: Order) => {
  selectedOrder.value =   await orderStore.fetchOrderById(order.id);
  //selectedOrder.value = await orderStore.fetchOrderById(order.id);
  showOrderDetailsModal.value = true;
};

const editOrder = async (order: Order) => {
  selectedOrder.value = await orderStore.fetchOrderById(order.id);
  showOrderModal.value = true;
};

const deleteOrder = async (order: Order) => {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      await orderStore.deleteOrder(order.id);
      await orderStore.fetchOrders();
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  }
};

const onOrderAdded = async () => {
  showOrderModal.value = false;
  await orderStore.fetchOrders();
};

const onOrderUpdated = async () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
  await orderStore.fetchOrders();
};

const closeErrorModal = () => {
  showErrorModal.value = false;
};
</script>

<style scoped>
.add-order-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-order-button:hover {
  background-color: #0056b3;
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

.product-table th, .product-table td {
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
}

.error-modal button:hover {
  background-color: #0056b3;
}
</style>
