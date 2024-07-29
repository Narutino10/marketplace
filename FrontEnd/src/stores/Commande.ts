import { defineStore } from 'pinia';
import axiosInstance from "@/services/api";
import { ref } from 'vue';
import { useAuthStore } from "@/stores/user";

export interface Order {
    id: number;
    dateOrder: Date;
    statusOrder: string;
    totalAmount: number;
    userId: number;
    OrderDetails: OrderDetail[];
}

export interface OrderDetail {
    productId: string;
    productName: string;
    productDescription: string;
    productCategory: string;
    productBrand: string;
    unitPrice: number;
    quantity: number;
}

interface OrderCreateData {
    userId: number;
    statusOrder: string;
    totalAmount: number;
    products: { productId: string; quantity: number }[];
}

interface OrderUpdateData {
    statusOrder?: string;
    totalAmount?: number;
    products?: { productId: string; quantity: number }[];
}

export const useOrderStore = defineStore('order', () => {
    const orders = ref<Order[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const authStore = useAuthStore();

    const fetchOrders = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get('/orders');
            orders.value = response.data;
        } catch (err) {
            error.value = 'Échec de la récupération des commandes';
        } finally {
            isLoading.value = false;
        }
    };
    const getOrderByUserId = async (userId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/orders/user/${userId}`);
            orders.value = response.data;
        } catch (err) {
            error.value = `Échec de la récupération des commandes de l'utilisateur avec l'ID ${userId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchOrderById = async (orderId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/orders/${orderId}`);
            return response.data;
        } catch (err) {
            error.value = `Échec de la récupération de la commande avec l'ID ${orderId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };

    const createOrder = async (orderData: Omit<OrderCreateData, 'userId'>) => {
        isLoading.value = true;
        error.value = null;
        try {
            // Ajoutez le userId à orderData
            const data: OrderCreateData = {
                ...orderData,
                userId: authStore.user?.id || 0,
            };
            const response = await axiosInstance.post('/orders', data);
            orders.value.push(response.data);
            console.log(response.data);
            return response.data
        } catch (err) {
            error.value = 'Échec de la création de la commande';
        } finally {
            isLoading.value = false;
        }
    };

    const updateOrder = async (orderId: number, updates: OrderUpdateData) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.put(`/orders/${orderId}`, updates);
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Échec de la mise à jour de la commande avec l'ID ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const deleteOrder = async (orderId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            await axiosInstance.delete(`/orders/${orderId}`);
            orders.value = orders.value.filter(order => order.id !== orderId);
        } catch (err) {
            error.value = `Échec de la suppression de la commande avec l'ID ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const addProductToOrder = async (orderId: number, productId: string, quantity: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.post(`/orders/${orderId}/products/${productId}`, { quantity });
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Échec de l'ajout du produit à la commande avec l'ID ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const removeProductFromOrder = async (orderId: number, productId: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.delete(`/orders/${orderId}/products/${productId}`);
            const index = orders.value.findIndex(order => order.id === orderId);
            if (index !== -1) {
                orders.value[index] = response.data;
            }
        } catch (err) {
            error.value = `Échec de la suppression du produit de la commande avec l'ID ${orderId}`;
        } finally {
            isLoading.value = false;
        }
    };

    const getProductsFromOrder = async (orderId: number) => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await axiosInstance.get(`/orders/${orderId}/products`);
            return response.data;
        } catch (err) {
            error.value = `Échec de la récupération des produits de la commande avec l'ID ${orderId}`;
            return null;
        } finally {
            isLoading.value = false;
        }
    };


    return {
        getOrderByUserId,
        orders,
        isLoading,
        error,
        fetchOrders,
        fetchOrderById,
        createOrder,
        updateOrder,
        deleteOrder,
        addProductToOrder,
        removeProductFromOrder,
        getProductsFromOrder,
    };
});
