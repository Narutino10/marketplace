<template>
  <div>
    <button class="add-product-button" @click="showProductModal = true">Add Product</button>
    <button class="inject-products-button" @click="handleInjectProducts">Inject Products</button>

    <Table
        :items="combinedProducts"
        :columns="columns"
        :itemsPerPage="10"
        @view="viewProduct"
        @edit="editProduct"
        @delete="deleteProduct"
    />

    <Modal v-model="showProductModal" :title="modalTitle">
      <AddProductForm
          :initialData="selectedProduct"
          @product-added="onProductAdded"
          @product-updated="onProductUpdated"
      />
    </Modal>

    <Modal v-if="showProductDetailsModal" v-model="showProductDetailsModal" :title="selectedProduct?.name">
      <div class="product-details-modal">
        <div class="image-section">
          <img :src="getImage(selectedProduct)" alt="Product Image" class="product-details-image" v-if="selectedProduct?.images?.length">
        </div>
        <div class="info-section">
          <h3 class="product-details-title">{{ selectedProduct?.name }}</h3>
          <p><strong>Category:</strong> {{ selectedProduct?.category }}</p>
          <p><strong>Brand:</strong> {{ selectedProduct?.brand }}</p>
          <p><strong>Price:</strong> {{ selectedProduct?.price }}</p>
          <p><strong>Stock:</strong> {{ selectedProduct?.stock_available }}</p>
          <p><strong>Status:</strong> {{ selectedProduct?.status }}</p>
          <p><strong>Description:</strong> {{ selectedProduct?.description }}</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProductStore } from '@/stores/products';
import { useAuthStore } from '@/stores/user';

import Table from '@/components/common/Table.vue';
import Modal from '@/components/common/Modale.vue';
import AddProductForm from '@/components/common/AddProductForm.vue';
import type { Product } from '@/stores/products';

interface Column<T> {
  key: keyof T & string;
  label: string;
  searchable?: boolean;
}

const productStore = useProductStore();
const authStore = useAuthStore();

const showProductModal = ref(false);
const showProductDetailsModal = ref(false);
const selectedProduct = ref<Partial<Product> | undefined>(undefined);

const combinedProducts = computed(() => productStore.products);

const modalTitle = computed(() => selectedProduct.value ? 'Edit Product' : 'Add Product');

const columns: Column<Product>[] = [
  { key: 'name', label: 'Name', searchable: true },
  { key: 'category', label: 'Category', searchable: true },
  { key: 'brand', label: 'Brand', searchable: true },
  { key: 'price', label: 'Price' },
  { key: 'stock_available', label: 'Stock' },
  { key: 'status', label: 'Status' }
];

onMounted(async () => {
  await productStore.fetchProducts();
  await authStore.fetchUsers();
});

watch(() => productStore.products, (newProducts) => {
  console.log('Products in store changed:', newProducts);
}, { deep: true });

const getImage = (product: Partial<Product> | undefined) => {
  if (product?.images && product.images.length > 0) {
    const baseUrl = 'http://localhost:3000';
    return `${baseUrl}/${product.images[0]}`;
  }
  return 'path/to/default/image.jpg';
};

const viewProduct = (product: Product) => {
  selectedProduct.value = { ...product };
  showProductDetailsModal.value = true;
};

const editProduct = (product: Product) => {
  selectedProduct.value = { ...product };
  showProductModal.value = true;
};

const deleteProduct = async (product: Product) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productStore.deleteProduct(product._id ?? '');
      await productStore.fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};

const handleInjectProducts = async () => {
  try {
    const message = await productStore.injectProducts();
    alert(message);
  } catch (error) {
    alert('Failed to inject products');
  }
};

const onProductAdded = async () => {
  showProductModal.value = false;
  await productStore.fetchProducts();
};

const onProductUpdated = async () => {
  showProductModal.value = false;
  selectedProduct.value = undefined;
  await productStore.fetchProducts();
};
</script>

<style scoped>
.add-product-button,
.inject-products-button {
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

.add-product-button:hover,
.inject-products-button:hover {
  background-color: #0056b3;
}

.product-details-modal {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.image-section {
  flex: 1;
  text-align: center;
  margin-bottom: 20px;
}

.product-details-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 auto;
  border-radius: 8px;
}

.info-section {
  flex: 2;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.product-details-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.product-details-modal p {
  margin: 10px 0;
  color: #333;
}

.product-details-modal strong {
  color: #555;
}
</style>
