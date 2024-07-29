<template>
  <button @click="$emit('click')" :class="class">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  class: String
});
</script>

<style scoped>
button {
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}
</style>
