import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/user';
import { useProductStore } from '@/stores/products';
import axiosInstance from "@/services/api";
import type { Product } from '@/stores/products';

type CartProduct = Pick<Product, '_id' | 'name' | 'price' | 'images'> & { quantity: number, reservedUntil?: Date };

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartProduct[]>(JSON.parse(localStorage.getItem('cartItems') || '[]'));
    const authStore = useAuthStore();
    const productStore = useProductStore();

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    const addToCart = async (product: Pick<Product, '_id' | 'name' | 'price' | 'images'>, quantity: number = 1) => {
        const existingItem = items.value.find(item => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            items.value.push({ ...product, quantity });
        }
        saveCart();

        if (isAuthenticated.value) {
            try {
                const response = await axiosInstance.post('/cart/', {
                    productid: product._id.toString(),
                    quantity,
                    userid: authStore.user?.id
                });
                const reservedUntil = new Date(response.data.reservedUntil);
                if (existingItem) {
                    existingItem.reservedUntil = reservedUntil;
                } else {
                    const addedItem = items.value.find(item => item._id === product._id);
                    if (addedItem) {
                        addedItem.reservedUntil = reservedUntil;
                    }
                }
                saveCart();
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    };

    const updateCartItemQuantity = async (index: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(index);
            return;
        }

        const product = items.value[index];
        product.quantity = quantity;
        saveCart();

        if (isAuthenticated.value) {
            try {
                await axiosInstance.put(`/cart/update`, {
                    userid: authStore.user?.id,
                    productid: product._id,
                    quantity
                });
                saveCart();
            } catch (error) {
                console.error('Error updating cart item quantity:', error);
            }
        }
    };

    const removeFromCart = async (index: number) => {
        const product = items.value[index];
        items.value.splice(index, 1);
        saveCart();

        if (isAuthenticated.value) {
            try {
                await axiosInstance.delete(`/cart/${product._id}`);
                saveCart();
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        }
    };

    const calculateTotals = () => {
        return items.value.reduce(
            (totals, item) => {
                totals.subtotal += item.price * item.quantity;
                totals.total += item.price * item.quantity;
                return totals;
            },
            { subtotal: 0, total: 0 }
        );
    };

    const saveCart = () => {
        localStorage.setItem('cartItems', JSON.stringify(items.value));
    };

    const loadCart = async () => {
        items.value = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (isAuthenticated.value) {
            await loadCartFromBackend();
        }
    };

    const loadCartFromBackend = async () => {
        try {
            items.value = []; // Clear existing cart items to avoid duplicates
            const userid = authStore.user?.id;
            const response = await axiosInstance.get(`/cart/${userid}`);
            const cartItems = response.data;

            for (const item of cartItems) {
                const product = await productStore.getProductById(item.product._id);
                const existingItem = items.value.find(cartItem => cartItem._id === product._id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    items.value.push({
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        images: product.images,
                        quantity: item.quantity,
                        reservedUntil: new Date(item.reservedUntil),
                    });
                }
            }
            saveCart();
        } catch (error) {
            console.error('Error loading cart from backend:', error);
        }
    };

    const clearCart = () => {
        items.value = [];
        localStorage.removeItem('cartItems');
    };

    const checkReservations = () => {
        const now = new Date();
        items.value = items.value.filter(item => item.reservedUntil && new Date(item.reservedUntil) > now);
        saveCart();
    };

    window.addEventListener('beforeunload', () => {
        saveCart();
    });

    watch(items, saveCart, { deep: true });

    loadCart();

    setInterval(checkReservations, 60000);

    return {
        items,
        addToCart,
        removeFromCart,
        calculateTotals,
        saveCart,
        loadCart,
        clearCart,
        updateCartItemQuantity,
    };
});
