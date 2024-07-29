<template>
  <div class="addresses-section">
    <h2>Mes Adresses</h2>
    <div v-if="isLoading" class="loading">Chargement...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="!isLoading && addresses.length === 0" class="no-addresses">Vous n'avez pas encore ajouté d'adresse.</div>
    <div v-if="!isLoading && addresses.length > 0" class="addresses-grid">
      <div v-for="address in addresses" :key="address.id" class="address-card">
        <p>{{ address.address }}</p>
        <p>{{ address.city }}, {{ address.department }} {{ address.postalcode }}</p>
        <p>{{ address.country }}</p>
        <button @click="editAddress(address.id)">Modifier</button>
        <button @click="removeAddress(address.id)">Supprimer</button>
      </div>
    </div>
    <button @click="addAddress" class="add-address-button">Ajouter une adresse</button>
    <Modal v-model="showAddressModal" :title="modalTitle">
      <div class="address-form">
        <label for="address">Adresse:</label>
        <input type="text" id="address" v-model="addressForm.address" required />

        <label for="city">Ville:</label>
        <input type="text" id="city" v-model="addressForm.city" required />

        <label for="postalcode">Code Postal:</label>
        <input type="text" id="postalcode" v-model="addressForm.postalcode" required />

        <label for="department">Département:</label>
        <input type="text" id="department" v-model="addressForm.department" />

        <label for="country">Pays:</label>
        <input type="text" id="country" v-model="addressForm.country" required />

        <button @click="saveAddress">Enregistrer</button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAddressStore } from '@/stores/Addresses';
import Modal from '@/components/common/Modale.vue';

const props = defineProps<{
  user: { id: number } | null,
  addresses: Array<{
    id: number,
    address: string,
    city: string,
    postalcode: string,
    department: string | null,
    country: string
  }>
}>();

const addressStore = useAddressStore();

const isLoading = ref(false);
const error = ref<string | null>(null);
const showAddressModal = ref(false);
const modalTitle = ref('Ajouter une adresse');
const addressForm = ref({
  id: null,
  address: '',
  city: '',
  postalcode: '',
  department: '',
  country: ''
});

const addresses = ref(props.addresses ?? []);

const fetchAddresses = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    if (props.user) {
      const fetchedAddresses = await addressStore.fetchAddressesByUserId(props.user.id);
      addresses.value = fetchedAddresses;
    }
  } catch (err) {
    error.value = 'Échec de la récupération des adresses';
  } finally {
    isLoading.value = false;
  }
};

const addAddress = () => {
  modalTitle.value = 'Ajouter une adresse';
  resetForm();
  showAddressModal.value = true;
};

const editAddress = async (addressId: number) => {
  const address = await addressStore.fetchAddressById(addressId);
  if (address) {
    modalTitle.value = 'Modifier l\'adresse';
    addressForm.value = { ...address };
    showAddressModal.value = true;
  }
};

const saveAddress = async () => {
  if (addressForm.value.id) {
    await addressStore.updateAddress(addressForm.value.id, addressForm.value);
  } else {
    await addressStore.createAddress(addressForm.value);
  }
  showAddressModal.value = false;
  fetchAddresses();
};

const removeAddress = async (addressId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
    await addressStore.deleteAddress(addressId);
    fetchAddresses();
  }
};

const resetForm = () => {
  addressForm.value = {
    id: null,
    address: '',
    city: '',
    postalcode: '',
    department: '',
    country: ''
  };
};

watch(() => props.user, fetchAddresses, { immediate: true });

onMounted(fetchAddresses);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

.addresses-section {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.addresses-section h2 {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  color: #333;
}

.address-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.address-card p {
  margin: 5px 0;
}

.address-card button {
  padding: 10px 20px;
  background-color: #23a6f0;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
}

.address-card button:hover {
  background-color: #1d94d2;
}

.add-address-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  margin: 20px auto;
}

.add-address-button:hover {
  background-color: #0056b3;
}

.loading, .error, .no-addresses {
  text-align: center;
  margin-top: 20px;
  font-family: 'Montserrat', sans-serif;
}

.address-form label {
  display: block;
  margin: 10px 0 5px;
  font-family: 'Montserrat', sans-serif;
}

.address-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Montserrat', sans-serif;
}

.address-form button {
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
  display: block;
  margin: 20px auto;
}

.address-form button:hover {
  background-color: #218838;
}
</style>
