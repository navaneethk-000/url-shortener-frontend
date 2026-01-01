<script setup>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const props = defineProps({
  clicks: { type: Array, required: true },
});

const canvas = ref(null);
let chart = null;

const prepareSteppedData = () => {
  const sortedClicks = [...props.clicks].sort(
    (a, b) => new Date(a.clicked_at) - new Date(b.clicked_at)
  );

  const labels = [];
  const values = [];
  let runningTotal = 0;

  // Initial Zero Point
  if (sortedClicks.length > 0) {
    const firstClickTime = new Date(sortedClicks[0].clicked_at);
    labels.push(
      new Date(firstClickTime.getTime() - 1000 * 60).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    values.push(0);
  }

  sortedClicks.forEach((click) => {
    runningTotal++;
    const timeLabel = new Date(click.clicked_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    labels.push(timeLabel);
    values.push(runningTotal);
  });

  return { labels, values };
};

const initChart = () => {
  if (!canvas.value) return;
  if (chart) chart.destroy();

  const { labels, values } = prepareSteppedData();
  const ctx = canvas.value.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(99, 102, 241, 0.2)"); // Indigo 500
  gradient.addColorStop(1, "rgba(15, 23, 42, 0)"); // Slate 900

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Cumulative Clicks",
          data: values,
          fill: true,
          backgroundColor: gradient,
          borderColor: "#818cf8", // Indigo 400
          borderWidth: 2,
          stepped: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointBackgroundColor: "#6366f1", // Indigo 500
          pointBorderColor: "#0f172a", // Slate 900
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#1e293b", // Slate 800
          titleColor: "#94a3b8",
          bodyColor: "#ffffff",
          bodyFont: { weight: "bold", size: 14 },
          padding: 12,
          displayColors: false,
          borderColor: "rgba(255,255,255,0.05)",
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#475569", font: { size: 10 } },
        },
        y: {
          position: "right",
          beginAtZero: true,
          grid: { color: "rgba(255, 255, 255, 0.03)" },
          ticks: {
            color: "#475569",
            font: { size: 10 },
            stepSize: 1,
            padding: 10,
          },
        },
      },
    },
    plugins: [
      {
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.shadowColor = "rgba(99, 102, 241, 0.4)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        },
        afterDraw: (chart) => {
          chart.ctx.restore();
        },
      },
    ],
  });
};

onMounted(() => initChart());
watch(
  () => props.clicks,
  () => initChart(),
  { deep: true }
);
</script>

<template>
  <div class="relative w-full h-full min-h-[300px]">
    <canvas ref="canvas"></canvas>
  </div>
</template>
