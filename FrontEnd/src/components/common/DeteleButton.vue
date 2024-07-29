<template>
  <div>
    <button @click="showConfirmation = true">Supprimer</button>
    <div v-if="showConfirmation" class="confirmation-dialog">
      <h3>Confirmer la suppression</h3>
      <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
      <div class="confirmation-actions">
        <button @click="confirmDelete" :disabled="isDeleting">Confirmer</button>
        <button @click="showConfirmation = false">Annuler</button>
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  onDelete: () => Promise<void>;
}>();

const showConfirmation = ref(false);
const isDeleting = ref(false);
const error = ref<string | null>(null);

const confirmDelete = async () => {
  isDeleting.value = true;
  error.value = null;
  try {
    await props.onDelete();
    showConfirmation.value = false;
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la suppression de lélément.';
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
.confirmation-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.confirmation-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>