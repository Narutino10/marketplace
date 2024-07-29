<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title);

const props = defineProps({
  chartData: Object
});

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvas.value) {
    new Chart(canvas.value, {
      type: 'line',
      data: props.chartData
    });
  }
});
</script>
