<template>
  <div>
    <h2>{{ isEditing ? 'Edit' : 'Add New' }} Product</h2>
    <form @submit.prevent="submitForm">
      <div v-for="field in formFields" :key="field.name">
        <label :for="field.name">{{ field.label }}:</label>
        <input v-if="field.type !== 'select' && field.type !== 'file'"
               :type="field.type"
               :id="field.name"
               v-model="productData[field.name]"
               required
        />
        <select v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="productData[field.name]"
                required
        >
          <option v-for="option in field.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <input v-else
               type="file"
               :id="field.name"
               @change="handleFileUpload"
               accept="image/*"
        />
      </div>
      <button type="submit" :disabled="loading">{{ isEditing ? 'Update' : 'Add' }} Product</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useProductStore } from '@/stores/products';

interface ProductData {
  _id?: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  stock_available: number;
  status: string;
  image: string;
}

interface FormField {
  name: keyof ProductData;
  type: string;
  label: string;
  options?: string[];
}

const props = defineProps<{
  initialData?: Partial<ProductData>
}>();

const emit = defineEmits<{
  (e: 'product-added'): void;
  (e: 'product-updated'): void;
}>();

const productStore = useProductStore();

const formFields: FormField[] = [
  { name: 'name', type: 'text', label: 'Product Name' },
  { name: 'description', type: 'textarea', label: 'Description' },
  { name: 'category', type: 'text', label: 'Category' },
  { name: 'brand', type: 'text', label: 'Brand' },
  { name: 'price', type: 'number', label: 'Price' },
  { name: 'stock_available', type: 'number', label: 'Stock Available' },
  { name: 'status', type: 'select', label: 'Status', options: ['available', 'out_of_stock', 'discontinued'] },
  { name: 'image', type: 'file', label: 'Image' },
];

const productData = ref<ProductData>({
  name: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  stock_available: 0,
  status: 'available',
  image: '',
});

const isEditing = computed(() => !!props.initialData?._id);
const error = ref('');
const loading = ref(false);

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    productData.value = {
      name: newVal.name || '',
      description: newVal.description || '',
      category: newVal.category || '',
      brand: newVal.brand || '',
      price: newVal.price || 0,
      stock_available: newVal.stock_available || 0,
      status: newVal.status || 'available',
      image: newVal.image || '',
      _id: newVal._id,
    };
  }
}, { deep: true });

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    productData.value.image = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  loading.value = true;
  error.value = '';

  try {
    const formData = new FormData();
    Object.entries(productData.value).forEach(([key, value]) => {
      if (key !== '_id' && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append('image', fileInput.files[0]);
    }

    if (isEditing.value && productData.value._id) {
      await productStore.updateProduct(productData.value._id, formData);
      emit('product-updated');
    } else {
      await productStore.createProduct(formData);
      emit('product-added');
    }

    if (!isEditing.value) {
      productData.value = {
        name: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        stock_available: 0,
        status: 'available',
        image: '',
      };
    }
  } catch (err) {
    error.value = 'An error occurred while submitting the product.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  color: black;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error {
  color: red;
}
</style>