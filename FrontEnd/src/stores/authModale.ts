import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthModalStore = defineStore('authModal', () => {
    const isVisible = ref(false);

    function openModal() {
        isVisible.value = true;
    }

    function closeModal() {
        isVisible.value = false;
    }

    return {
        isVisible,
        openModal,
        closeModal
    };
});
