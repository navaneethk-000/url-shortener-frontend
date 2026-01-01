<script setup>
const authStore = useAuthStore();
const toastStore = useToastStore();

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const config = useRuntimeConfig();
const code = route.params.code;

const qrFg = ref("#000000");
const qrBg = ref("#ffffff");
const isSaving = ref(false);

const { data, pending, error, refresh } = await useFetch(
  `${config.public.apiBase}/api/stats/${code}`,
  {
    key: `stats-${code}`,
    server: false,
    lazy: true,
  }
);

// Ensures previous choices are restored when the page loads or data refreshes
watch(
  data,
  (newVal) => {
    if (newVal?.url_data) {
      qrFg.value = newVal.url_data.qr_color || "#000000";
      qrBg.value = newVal.url_data.qr_bg_color || "#ffffff";
    }
  },
  { immediate: true }
);

// QR Code Helper (Reactive to color pickers)
const qrLink = computed(() => {
  const base = config.public.apiBase.replace(/\/$/, "");
  const fg = qrFg.value.replace("#", "");
  const bg = qrBg.value.replace("#", "");
  return `${base}/api/qr/${code}?fg=${fg}&bg=${bg}`;
});

// Save Styles to Database
const saveStyles = async () => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/shorten/${code}/styles`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        qr_color: qrFg.value,
        qr_bg_color: qrBg.value,
      },
    });

    // Use Pinia toastStore
    toastStore.success("QR Styles saved successfully!");
    refresh();
  } catch (e) {
    toastStore.error("Failed to save styles");
  } finally {
    isSaving.value = false;
  }
};

// Download Function
const downloadQR = () => {
  const downloadUrl = qrLink.value + "&download=true";
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.setAttribute("download", `qr_${code}.png`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<
<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-0 pb-10">
    <!-- Back Navigation -->
    <NuxtLink
      to="/"
      class="group inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium mb-6 sm:mb-8 transition-all duration-200"
    >
      <div
        class="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500/20 transition-colors"
      >
        <svg
          class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </div>
      <span>Back to Dashboard</span>
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-24 sm:py-32">
      <div class="relative mx-auto w-14 h-14 sm:w-16 sm:h-16">
        <div
          class="absolute inset-0 rounded-full border-4 border-indigo-500/30"
        ></div>
        <div
          class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
        ></div>
      </div>
      <p class="text-slate-400 mt-6 font-medium animate-pulse">
        Loading analytics data...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-500/10 p-6 sm:p-8 rounded-2xl border border-red-500/20 text-center max-w-lg mx-auto backdrop-blur-sm"
    >
      <p class="font-bold text-red-400 text-lg">Error loading stats</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- TOP GRID -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Clicks Card -->
        <div class="relative group md:col-span-2">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"
          ></div>

          <div
            class="relative h-full bg-slate-900 border border-white/10 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-xl text-center flex flex-col justify-center"
          >
            <h1
              class="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight"
            >
              {{ data.url_data.total_clicks }}
            </h1>

            <p
              class="text-indigo-400 uppercase tracking-widest text-xs font-bold mt-2"
            >
              Total Clicks
            </p>

            <div class="mt-6 sm:mt-10 border-t border-white/5 pt-4 sm:pt-6">
              <p
                class="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-2"
              >
                Original Destination
              </p>
              <a
                :href="data.url_data.original_url"
                target="_blank"
                class="text-xs sm:text-sm text-indigo-400 hover:underline break-all sm:truncate block"
              >
                {{ data.url_data.original_url }}
              </a>
              <div class="h-[300px]">
                <AnalyticsChart :clicks="data.analytics" />
              </div>
            </div>
          </div>
        </div>

        <!-- QR Customizer -->
        <div
          class="bg-slate-900 border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center"
        >
          <h3
            class="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest"
          >
            QR Customizer
          </h3>

          <div class="bg-white p-3 rounded-xl shadow-lg mb-5">
            <img
              :src="qrLink"
              alt="QR Code"
              class="w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36"
            />
          </div>

          <div class="w-full space-y-3 mb-6">
            <div
              class="flex justify-between items-center bg-slate-950/50 p-2 rounded border border-white/5"
            >
              <span class="text-[10px] text-slate-500 uppercase font-bold">
                Dots
              </span>
              <input
                type="color"
                v-model="qrFg"
                class="h-6 w-10 cursor-pointer"
              />
            </div>

            <div
              class="flex justify-between items-center bg-slate-950/50 p-2 rounded border border-white/5"
            >
              <span class="text-[10px] text-slate-500 uppercase font-bold">
                Background
              </span>
              <input
                type="color"
                v-model="qrBg"
                class="h-6 w-10 cursor-pointer"
              />
            </div>
          </div>

          <div class="grid gap-2 w-full">
            <button
              @click="saveStyles"
              :disabled="isSaving"
              class="w-full py-3 sm:py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition disabled:opacity-50"
            >
              {{ isSaving ? "Saving..." : "Save Style" }}
            </button>

            <button
              @click="downloadQR"
              class="w-full py-3 sm:py-2 flex items-center justify-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition border border-white/5"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>

      <!-- HISTORY TABLE -->
      <div
        class="bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
      >
        <div
          class="px-4 sm:px-6 py-4 border-b border-white/5 bg-slate-950/30 flex justify-between items-center"
        >
          <h3 class="text-lg font-bold text-white">📊 Recent Activity</h3>
          <span
            class="text-xs font-semibold text-slate-400 bg-slate-800 border border-white/5 px-2.5 py-1 rounded-full"
          >
            {{ data.analytics.length }} Records
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-[700px] w-full text-left text-sm">
            <thead
              class="bg-slate-950/50 text-slate-400 border-b border-white/5"
            >
              <tr>
                <th class="px-3 sm:px-6 py-4 font-semibold">Time</th>
                <th class="px-3 sm:px-6 py-4 font-semibold">Location</th>
                <th class="px-3 sm:px-6 py-4 font-semibold">IP</th>
                <th class="px-3 sm:px-6 py-4 font-semibold">Referrer</th>
                <th class="px-3 sm:px-6 py-4 font-semibold">User Agent</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-white/5">
              <tr
                v-for="click in data.analytics"
                :key="click.id"
                class="hover:bg-white/[0.02]"
              >
                <td class="px-3 sm:px-6 py-3 text-slate-300 whitespace-nowrap">
                  {{ new Date(click.clicked_at).toLocaleString() }}
                </td>
                <td class="px-3 sm:px-6 py-3 text-slate-300">
                  {{ click.country || "-" }}
                </td>
                <td class="px-3 sm:px-6 py-3">
                  <span
                    class="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded"
                  >
                    {{ click.ip_address }}
                  </span>
                </td>
                <td class="px-3 sm:px-6 py-3 text-xs">
                  {{ click.referrer || "Direct" }}
                </td>
                <td
                  class="px-3 sm:px-6 py-3 text-xs text-slate-500 break-all max-w-[220px]"
                >
                  {{ click.user_agent }}
                </td>
              </tr>

              <tr v-if="data.analytics.length === 0">
                <td colspan="5" class="py-20 text-center text-slate-400">
                  No records found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
