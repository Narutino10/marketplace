<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, PieController, ArcElement, CategoryScale, Title } from 'chart.js';

Chart.register(PieController, ArcElement, CategoryScale, Title);

const props = defineProps({
  chartData: Object
});

const canvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (canvas.value) {
    new Chart(canvas.value, {
      type: 'pie',
      data: props.chartData
    });
  }
});
</script>
