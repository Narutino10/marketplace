<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Add Widget</h2>
      <form @submit.prevent="addWidget">
        <div>
          <label for="type">Widget Type:</label>
          <select v-model="widgetType" id="type" required>
            <option value="" disabled>Select type</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
        <div>
          <label for="x">Position X:</label>
          <input type="number" v-model.number="widgetX" id="x" required />
        </div>
        <div>
          <label for="y">Position Y:</label>
          <input type="number" v-model.number="widgetY" id="y" required />
        </div>
        <div>
          <label for="width">Width:</label>
          <input type="number" v-model.number="widgetWidth" id="width" required />
        </div>
        <div>
          <label for="height">Height:</label>
          <input type="number" v-model.number="widgetHeight" id="height" required />
        </div>
        <button type="submit">Add Widget</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  isVisible: Boolean
});
const emit = defineEmits(['close', 'add-widget']);

const widgetType = ref('');
const widgetX = ref(0);
const widgetY = ref(0);
const widgetWidth = ref(4);
const widgetHeight = ref(6);

const addWidget = () => {
  emit('add-widget', {
    type: widgetType.value,
    x: widgetX.value,
    y: widgetY.value,
    w: widgetWidth.value,
    h: widgetHeight.value,
  });
  clearForm();
  emit('close');
};

const clearForm = () => {
  widgetType.value = '';
  widgetX.value = 0;
  widgetY.value = 0;
  widgetWidth.value = 4;
  widgetHeight.value = 6;
};
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
