<script setup>
import { toRef, watch, ref, computed } from "vue";
import { Scatter } from "vue-chartjs";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  LogarithmicScale,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(PointElement, LineElement, Tooltip, Legend, LogarithmicScale);
//TODO:
// 1. adjust the size of the chart
// 2. change the style of toggle line button
// 3. fix tooltip
const props = defineProps({
  pros: {
    type: Object,
    default: () => ({ objects: [] }),
  },
});

const pros = toRef(props, "pros");

const showTheoryLine = ref(true);

const data = computed(() => {
  const result = { datasets: [] };
  pros.value.objects.forEach((object) => {
    const color = "#" + object.color.toString(16).padStart(6, "0");
    result.datasets.push({
      label: object.name,
      fill: false,
      borderColor: color,
      backgroundColor: color,
      data: [
        { x: object.period, y: object.orbitalParameters.a, text: object.name },
      ],
    });
  });
  result.datasets.sort((a, b) => a.data[0].y - b.data[0].y);

  if (showTheoryLine.value) {
    const firstPoint = result.datasets[0].data[0];
    const lastPoint = result.datasets[result.datasets.length - 1].data[0];
    result.datasets.push({
      type: "line",
      label: "理論線",
      data: [
        { x: firstPoint.x, y: firstPoint.y, text: "m≈0.6667" },
        { x: lastPoint.x, y: lastPoint.y },
      ],
      backgroundColor: "#0000F0",
      borderColor: "#0000F0",
      xAxisID: "x2",
    });
  }
  return result;
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      display: true,
      type: "logarithmic",
      title: {
        display: true,
        text: "Orbital Period (year)",
      },
    },
    x2: {
      display: false,
      position: "bottom",
      type: "logarithmic",
    },
    y: {
      display: true,
      type: "logarithmic",
      title: {
        display: true,
        text: "Semi-major axis (AU)",
      },
    },
  },
  plugins: {
    legend: {
      display: false, // 這裡禁用了圖例
    },
  },
};

const scatterDataLabels = {
  id: "scatterDataLabels",
  afterDraw(chart) {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      if (meta.type === "scatter") {
        meta.data.forEach((element, index) => {
          if (dataset.data[index].text) {
            const { x, y } = element.tooltipPosition();
            ctx.fillStyle = dataset.borderColor;
            ctx.font = "12px Arial";
            ctx.textAlign = "center";
            ctx.fillText(dataset.data[index].text, x, y - 10);
          }
        });
      } else if (meta.type === "line") {
        if (dataset.data[0].text && meta.data[0].x != meta.data[1].x) {
          const startPoint = meta.data[0];
          const endPoint = meta.data[meta.data.length - 1];
          const midX = (startPoint.x + endPoint.x) / 2;
          const midY = (startPoint.y + endPoint.y) / 2;

          ctx.fillStyle = dataset.borderColor;
          ctx.font = "18px Arial";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(dataset.data[0].text, midX + 20, midY);
        }
      }
    });
  },
};

const toggleTheoryLine = () => {
  showTheoryLine.value = !showTheoryLine.value;
};
</script>

<template>
  <div>
    Kepler's Third Law: The square of a planet's orbital period is directly
    proportional to the cube of its semi-major axis.
  </div>
  <div>
    This means that planets farther from the Sun take longer to complete one
    orbit.
  </div>
  <div>
    The animation demonstrates how planets move in their elliptical orbits.
  </div>
  <div>
    <button @click="toggleTheoryLine">
      {{ showTheoryLine ? "Hide Line" : "Show Line" }}
    </button>
  </div>
  <div v-if="pros.objects && pros.objects.length">
    <Scatter
      :data="data"
      :options="options"
      :plugins="[scatterDataLabels]"
      :width="400"
      :height="400"
    />
  </div>
</template>
