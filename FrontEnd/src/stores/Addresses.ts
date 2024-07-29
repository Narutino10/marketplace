import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import { ref } from 'vue';
import { useAuthStore } from '@/stores/user';

export interface Address {
    id: number;
    address: string;
    city: string;
    postalcode: string;
    department?: string;
    country: string;
    userid: number;
}

interface AddressCreateData {
    address: string;
    city: string;
    postalcode: string;
    department?: string;
    country: string;
}

interface AddressUpdateData {
    address?: string;
    city?: string;
    postalcode?: string;
    department?: string;
    country?: string;
}

export const useAddressStore = defineStore('address', () => {
    const addresses = ref<Address[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const authStore = useAuthStore();

    const fetchAddresses = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            if (authStore.isAuthenticated) {
                const response = await axiosInstance.get(`/addresses/users/${authStore.user?.id}/addresses`);
                addresses.value = response.data;
            } else {
                error.value = 'User not authenticated';
            }
        } catch (err) {
            error.value = 'Failed to fetch addresses';
        } finally {
            isLoading.value = false;
        }
    };

    const fetchAddressById = async (addressId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/addresses/${addressId}`);
            return response.data;
        } catch (err) {
            error.value = `Failed to fetch address with id ${addressId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const createAddress = async (addressData: AddressCreateData) => {
        isLoading.value = true;
        error.value = null;
        try {
            if (authStore.isAuthenticated) {
                const response = await axiosInstance.post('/addresses', {
                    ...addressData,
                    userid: authStore.user?.id
                });
                addresses.value.push(response.data);
            } else {
                error.value = 'User not authenticated';
            }
        } catch (err) {
            error.value = 'Failed to create address';
        } finally {
            isLoading.value = false;
        }
    };

    const updateAddress = async (addressId: number, updates: AddressUpdateData) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.put(`/addresses/${addressId}`, updates);
            const index = addresses.value.findIndex(address => address.id === addressId);
            if (index !== -1) {
                addresses.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Failed to update address with id ${addressId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteAddress = async (addressId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            await axiosInstance.delete(`/addresses/${addressId}`);
            addresses.value = addresses.value.filter(address => address.id !== addressId);
        } catch (err) {
            error.value = `Failed to delete address with id ${addressId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchAddressesByUserId = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            if (authStore.isAuthenticated) {
                const response = await axiosInstance.get(`/addresses/users/${authStore.user?.id}/addresses`);
                addresses.value = response.data;
            } else {
                error.value = 'User not authenticated';
            }
        } catch (err) {
            error.value = 'Failed to fetch addresses';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        fetchAddressesByUserId,
        addresses,
        isLoading,
        error,
        fetchAddresses,
        fetchAddressById,
        createAddress,
        updateAddress,
        deleteAddress,
    };
});
