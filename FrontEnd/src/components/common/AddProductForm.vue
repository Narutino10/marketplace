<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="field in formFields" :key="field.name" class="form-group">
      <label :for="field.name">{{ field.label }}</label>
      <input
          v-if="field.type === 'text'"
          :id="field.name"
          v-model="productData[field.name]"
          :type="field.type"
          class="form-control"
      />
      <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          v-model="productData[field.name]"
          class="form-control"
      ></textarea>
      <select
          v-else-if="field.type === 'select'"
          :id="field.name"
          v-model="productData[field.name]"
          class="form-control"
      >
        <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
      </select>
      <input
          v-else-if="field.type === 'number'"
          :id="field.name"
          v-model="productData[field.name]"
          :type="field.type"
          @input="validateNumberInput(field.name)"
          step="0.01"
          class="form-control"
      />
      <span v-if="errors[field.name]" class="error">{{ errors[field.name] }}</span>
    </div>
    <div class="form-group">
      <label for="images">Images</label>
      <input type="file" id="images" multiple @change="handleFileChange" class="form-control-file" />
      <div class="image-previews">
        <div v-for="(image, index) in images" :key="index" class="image-preview">
          <img :src="image.url" :alt="`Image ${index + 1}`" />
          <button @click.prevent="removeImage(index)" class="remove-button">X</button>
        </div>
      </div>
    </div>
    <button type="submit" :disabled="isSubmitting" class="submit-button">Submit</button>
    <div v-if="serverError" class="error">{{ serverError }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { z } from 'zod';
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
];

const productData = ref<ProductData>({
  name: '',
  description: '',
  category: '',
  brand: '',
  price: 0,
  stock_available: 0,
  status: 'available',
});

const isEditing = computed(() => !!props.initialData?._id);

watch(() => props.initialData, (newValue) => {
  if (newValue) {
    Object.assign(productData.value, newValue);
  }
}, { immediate: true });

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const serverError = ref<string | null>(null);

const images = ref<{ file: File; url: string }[]>([]);

const validationSchema = z.object({
  name: z.string().nonempty('Product Name is required'),
  description: z.string().nonempty('Description is required'),
  category: z.string().nonempty('Category is required'),
  brand: z.string().nonempty('Brand is required'),
  price: z.number().positive('Price must be a positive number'),
  stock_available: z.number().nonnegative('Stock Available must be a non-negative number'),
  status: z.enum(['available', 'out_of_stock', 'discontinued']),
});

const validate = () => {
  try {
    validationSchema.parse(productData.value);
    errors.value = {};
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.value = error.errors.reduce((acc, err) => {
        acc[err.path[0] as string] = err.message;
        return acc;
      }, {} as Record<string, string>);
    }
    return false;
  }
};

const validateNumberInput = (fieldName: keyof ProductData) => {
  const value = productData.value[fieldName];
  if (typeof value === 'number' && value < 0) {
    productData.value[fieldName] = 0 as never;
  }
};

const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    for (const file of files) {
      const url = URL.createObjectURL(file);
      images.value.push({ file, url });
    }
  }
};

const removeImage = (index: number) => {
  images.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return; // Prevent multiple submissions
  }

  if (validate()) {
    isSubmitting.value = true;
    serverError.value = null;

    try {
      const formData = new FormData();
      Object.entries(productData.value).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      images.value.forEach((image) => {
        formData.append('images', image.file); // Ajout des fichiers sous le champ 'images'
      });

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
        };
        images.value = [];
      }
    } catch (err) {
      serverError.value = 'An error occurred while submitting the form.';
    } finally {
      isSubmitting.value = false;
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #444;
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: bold;
  color: #666;
  margin-bottom: 0.5rem;
}

.form-control, .form-control-file {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-control:focus, .form-control-file:focus {
  border-color: #999;
  box-shadow: 0 0 8px rgba(153, 153, 153, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 120px;
}

.error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.image-preview {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  width: 100px;
  height: 100px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.75rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #555;
}

.submit-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
