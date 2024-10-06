<script setup>
import { computed, ref, watchEffect } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement
);

const props = defineProps(["pros"]);

const areaEntries = computed(() => {
  if (props.pros && props.pros.eachArea)
    return Object.entries(props.pros.eachArea).sort((a, b) => a[0] - b[0]);
  return [];
});

const chartData = ref({
  datasets: [
    {
      label: "掃過面積",
      backgroundColor: "#f87979",
      borderColor: "#f87979",
      data: [],
    },
  ],
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      type: "linear",
      title: {
        display: true,
        text: "Area No.",
      },
      ticks: {
        stepSize: 1,
        max: 7,
      },
    },
    y: {
      display: true,
      type: "linear",
      title: {
        display: true,
        text: "Area",
      },
      min: 0,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.parsed.y.toExponential(4)}`;
        },
        title: function () {
          return "";
        },
      },
    },
  },
};

watchEffect(() => {
  if (areaEntries.value) {
    chartData.value = {
      datasets: [
        {
          label: "Swept Area",
          backgroundColor: "#210eed",
          borderColor: "#210eed",
          data: areaEntries.value.map(([phase, area]) => ({
            x: parseFloat(phase),
            y: area,
          })),
        },
      ],
    };
  }
});

const formatArea = (area) => {
  return area ? area.toExponential(4) : "N/A";
};
</script>

<template>
  <div>
    <p>
      Around the same time, Kepler formulated his <em>Second Law</em> of
      planetary motion, also known as the <strong>law of equal areas</strong>.
      He discovered that a planet moves at different speeds along its elliptical
      orbit. A line drawn from the Sun to the planet sweeps out equal areas over
      equal time intervals, meaning
      <strong>the planet moves faster when it is closer to the Sun</strong>.
      This behavior is explained by the
      <strong>conservation of angular momentum</strong>, a fundamental concept
      in physics.<br />
      The figure shows the area swept out over 1/8 of the orbital period. You
      can see that after the area is swept, the line becomes almost flat,
      indicating that the area swept out in equal time intervals remains
      consistent.
    </p>

    <div class="chart-container">
      <Line :data="chartData" :options="options" />
    </div>
    <p>
      <strong>Hint: </strong>You can also select another planet or aseteriod.
    </p>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 250px;
  width: 100%;
}
</style>
