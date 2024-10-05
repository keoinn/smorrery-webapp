<script setup>
import { computed } from "vue";

const props = defineProps(["pros"]);

const areaEntries = computed(() => {
  if (props.pros)
    return Object.entries(props.pros.eachArea).sort((a, b) => a[0] - b[0]);
});

const formatArea = (area) => {
  return area ? area.toExponential(4) : "N/A";
};
</script>

<template>
  <div>
    <p>
      A line joining a planet and the Sun sweeps out equal areas during equal
      intervals of time.
    </p>
    <p>
      The orbital radius and angular velocity of the planet in the elliptical
      orbit will vary. This is shown in the animation: the planet travels faster
      when closer to the Sun, then slower when farther from the Sun. Kepler's
      second law states that the colored sector has constant area.
    </p>
    <table class="area-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Area</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[phase, area] in areaEntries" :key="phase">
          <td>{{ phase }}</td>
          <td>{{ formatArea(area) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.area-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.area-table th,
.area-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.area-table th {
  background-color: #ffffff;
  color: #000000;
  font-weight: bold;
}

.area-table tr:nth-child(even) {
  background-color: #ffffff;
  color: #000000;
}
.area-table tr:nth-child(odd) {
  background-color: #3e76fa;
}
</style>
