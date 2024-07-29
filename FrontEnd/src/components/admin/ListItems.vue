<template>
  <div>
    <h2>Dashboard</h2>
    <div class="widgets">
      <div class="widget widget-large">
        <h3>Users Statistics</h3>
        <BarChart :chartData="userChartData" />
      </div>
      <div class="widget widget-medium">
        <h3>Orders Statistics</h3>
        <PieChart :chartData="orderChartData" />
      </div>
      <div class="widget widget-small">
        <h3>Products Statistics</h3>
        <LineChart :chartData="productChartData" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BarChart from '@/components/widgets/BarChart.vue';
import PieChart from '@/components/widgets/PieChart.vue';
import LineChart from '@/components/widgets/LineChart.vue';

const userChartData = ref({
  labels: ['Active Users', 'Inactive Users'],
  datasets: [{
    label: 'Users',
    backgroundColor: ['#42A5F5', '#66BB6A'],
    data: [30, 10],
  }]
});

const orderChartData = ref({
  labels: ['Completed', 'Pending', 'Cancelled'],
  datasets: [{
    label: 'Orders',
    backgroundColor: ['#FF6384', '#FFCD56', '#36A2EB'],
    data: [50, 20, 10],
  }]
});

const productChartData = ref({
  labels: ['Electronics', 'Fashion', 'Home'],
  datasets: [{
    label: 'Products',
    borderColor: '#42A5F5',
    data: [40, 20, 30],
    fill: false,
  }]
});
</script>

<style scoped>
.widgets {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.widget {
  background-color: white;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.widget-large {
  width: 100%;
}

.widget-medium {
  width: 48%;
}

.widget-small {
  width: 30%;
}

.widget h3 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
