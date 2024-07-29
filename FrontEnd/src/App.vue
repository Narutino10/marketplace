<script setup lang="ts">


import { onMounted } from 'vue';
import { useCartStore } from '@/stores/panier';
import NavigationBar from "@/components/UI/NavigationBar.vue";
import AuthModal from "@/components/common/AuthModal.vue";
import { useAuthModalStore } from '@/stores/authModale';


import {useRoute} from "vue-router";

const cartStore = useCartStore();
const route = useRoute();
const authModalStore = useAuthModalStore();


onMounted(() => {
  cartStore.loadCart();
});

</script>

<template>
  <div id="app">
    <NavigationBar v-if="!route.path.startsWith('/admin')" />

    <router-view></router-view>
    <AuthModal :isVisible="authModalStore.isVisible" @close="authModalStore.closeModal" />

  </div>
</template>

<style >


</style>
