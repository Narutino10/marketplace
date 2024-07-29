import { ref, computed, watch } from 'vue';

export interface Product {
    _id: string;
    name: string;
    price: number;
    images: string[];
}

interface CartItem {
    product: Product;
    quantity: number;
}
export const useCart = () => {
    const cartItems = ref<CartItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'));

    const totalItems = computed(() => {
        return cartItems.value.reduce((total, item) => total + item.quantity, 0);
    });

    const totalPrice = computed(() => {
        return cartItems.value.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0);
    });

    watch(cartItems, (newCartItems) => {
        localStorage.setItem('cart', JSON.stringify(newCartItems));
    }, { deep: true });

    const addToCart = (product: Product, quantity: number) => {
        const existingItem = cartItems.value.find(item => item.product._id === product._id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.value.push({ product, quantity });
        }
    };

    const removeFromCart = (productId: string) => {
        cartItems.value = cartItems.value.filter(item => item.product._id !== productId);
    };

    const clearCart = () => {
        cartItems.value = [];
    };

    return {
        cartItems,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        clearCart
    };
};
