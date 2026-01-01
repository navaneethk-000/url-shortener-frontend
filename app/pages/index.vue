<script setup>
import ConfirmModal from "../components/ConfirmModal.vue";

const authStore = useAuthStore();
const toastStore = useToastStore();
const config = useRuntimeConfig();

definePageMeta({
  middleware: ["auth"],
});

// Form State
const longUrl = ref("");
const customAlias = ref("");
const result = ref(null);
const errorMsg = ref("");
const myLinks = ref([]);

// Modal State
const isModalOpen = ref(false);
const linkToDelete = ref(null);

// QR Customization State
const qrFg = ref("#000000");
const qrBg = ref("#ffffff");

// Validation Logic
const aliasError = computed(() => {
  if (customAlias.value.length > 10)
    return "Enter an alias with less than 10 characters";
  return "";
});

// Helper to Fetch Links (Authenticated)
const fetchMyLinks = async () => {
  if (!authStore.token) return;
  try {
    const { data } = await useFetch(`${config.public.apiBase}/api/user/urls`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      key: "user-urls",
      lazy: true,
      server: false,
    });
    if (data.value) myLinks.value = data.value;
    // Sync with lazy loading
    watch(data, (newVal) => {
      if (newVal) myLinks.value = newVal;
    });
  } catch (e) {
    console.error("Failed to fetch links");
  }
};

// Fetch links when the token is ready
watch(
  () => authStore.token,
  (newToken) => {
    if (newToken) fetchMyLinks();
  },
  { immediate: true }
);

// Link Shortening
const shortenUrl = async () => {
  errorMsg.value = "";
  result.value = null;

  if (aliasError.value) return;

  try {
    const { data, error } = await useFetch(
      `${config.public.apiBase}/api/shorten`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: {
          original_url: longUrl.value,
          custom_alias: customAlias.value || undefined,
          qr_color: qrFg.value,
          qr_bg_color: qrBg.value,
        },
      }
    );

    if (error.value) {
      errorMsg.value = error.value.data?.error || "Failed to shorten URL";
      toastStore.error(errorMsg.value);
      return;
    }

    result.value = data.value;
    if (data.value) {
      if (!myLinks.value) myLinks.value = [];
      myLinks.value.unshift(data.value);
      toastStore.success("URL successfully shortened!");
    }

    // Reset Form
    longUrl.value = "";
    customAlias.value = "";
  } catch (e) {
    errorMsg.value = "Network Connection Error";
  }
};

// Delete Shortlink
const confirmDelete = (shortCode) => {
  linkToDelete.value = shortCode;
  isModalOpen.value = true;
};

const executeDelete = async () => {
  if (!linkToDelete.value) return;
  isModalOpen.value = false;

  try {
    const { error } = await useFetch(
      `${config.public.apiBase}/api/shorten/${linkToDelete.value}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authStore.token}` },
      }
    );

    if (error.value) {
      toastStore.error("Failed to delete link");
      return;
    }

    myLinks.value = myLinks.value.filter(
      (link) => link.short_code !== linkToDelete.value
    );
    toastStore.success("Link deleted successfully");
  } catch (e) {
    toastStore.error("Network Error");
  }
};

const shortLink = computed(() =>
  result.value
    ? `${config.public.apiBase.replace(/\/$/, "")}/${result.value.short_code}`
    : ""
);

const qrLink = computed(() => {
  if (!result.value) return "";
  const base = config.public.apiBase.replace(/\/$/, "");
  // Remove # for URL parameters
  const fg = qrFg.value.replace("#", "");
  const bg = qrBg.value.replace("#", "");
  return `${base}/api/qr/${result.value.short_code}?fg=${fg}&bg=${bg}`;
});
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-0">
    <!-- Shortener Card -->
    <div class="relative group">
      <div
        class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"
      ></div>

      <div
        class="relative bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl"
      >
        <h2
          class="text-2xl sm:text-3xl font-extrabold text-white mb-6 sm:mb-8 text-center tracking-tight"
        >
          Shorten Your Link
        </h2>

        <div class="space-y-5 sm:space-y-6">
          <!-- Long URL Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Long URL
            </label>
            <input
              v-model="longUrl"
              type="url"
              placeholder="https://super-long-url.com/..."
              class="block w-full rounded-lg border border-slate-700 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-sm sm:text-base shadow-inner transition-colors"
            />
          </div>

          <!-- Alias -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Custom Alias (Optional)
            </label>
            <div class="flex rounded-lg shadow-sm overflow-hidden">
              <span
                class="inline-flex items-center px-4 border border-r-0 border-slate-700 bg-slate-800 text-slate-400 text-sm"
              >
                /
              </span>
              <input
                v-model="customAlias"
                type="text"
                placeholder="my-link"
                :class="{
                  'border-red-500/50': aliasError,
                  'border-slate-700': !aliasError,
                }"
                class="flex-1 block bg-slate-950/50 text-slate-200 border p-3 text-sm sm:text-base focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <p v-if="aliasError" class="text-sm text-red-400">
            ⚠ {{ aliasError }}
          </p>

          <button
            @click="shortenUrl"
            :disabled="!longUrl || !!aliasError"
            class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base shadow-lg hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            Shorten URL
          </button>
        </div>

        <!-- Error -->
        <div
          v-if="errorMsg"
          class="mt-6 p-4 bg-red-500/10 text-red-300 rounded-lg border border-red-500/20 text-center text-sm font-medium"
        >
          {{ errorMsg }}
        </div>

        <!-- Success Result -->
        <transition
          enter-active-class="transition ease-out duration-500"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="result"
            class="mt-8 bg-slate-800/50 rounded-xl border border-indigo-500/30 p-5 sm:p-6 text-center"
          >
            <p class="text-green-400 font-semibold mb-3">URL Shortened!</p>

            <a
              :href="shortLink"
              target="_blank"
              class="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 break-all block mb-6"
            >
              {{ shortLink }}
            </a>

            <!-- QR -->
            <div
              class="bg-slate-950/50 rounded-lg p-4 border border-white/5 space-y-4"
            >
              <div class="bg-white p-3 rounded-lg inline-block shadow-2xl">
                <img
                  :src="qrLink"
                  alt="QR Code"
                  class="w-32 h-32 sm:w-40 sm:h-40"
                />
              </div>
            </div>

            <div class="mt-6">
              <NuxtLink
                :to="`/stats/${result.short_code}`"
                class="text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
              >
                📊 View Analytics →
              </NuxtLink>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- My Links -->
    <div
      v-if="authStore.token && myLinks?.length"
      class="bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
    >
      <div
        class="px-5 sm:px-6 py-4 border-b border-white/5 bg-slate-950/30 flex justify-between items-center"
      >
        <h3 class="text-lg font-bold text-white">My Links</h3>
        <span
          class="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full"
        >
          {{ myLinks.length }} Total
        </span>
      </div>

      <ul class="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
        <li
          v-for="link in myLinks"
          :key="link.id"
          class="px-5 sm:px-6 py-4 hover:bg-white/[0.02] transition"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-slate-500">/</span>
                <a
                  :href="`${config.public.apiBase}/${link.short_code}`"
                  target="_blank"
                  class="text-indigo-400 font-bold hover:underline text-base sm:text-lg"
                >
                  {{ link.short_code }}
                </a>
              </div>
              <p class="text-xs text-slate-500 truncate mt-1">
                {{ link.original_url }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <div
                class="bg-slate-950 px-3 py-1.5 rounded-full border border-white/5 text-center"
              >
                <span class="block text-sm font-bold text-white">
                  {{ link.total_clicks }}
                </span>
                <span class="block text-[10px] text-slate-500 uppercase">
                  Clicks
                </span>
              </div>

              <div class="flex gap-1">
                <NuxtLink
                  :to="`/stats/${link.short_code}`"
                  class="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition"
                >
                  📊
                </NuxtLink>
                <button
                  @click="confirmDelete(link.short_code)"
                  class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Confirm Modal -->
    <ConfirmModal
      :is-open="isModalOpen"
      title="Delete Link?"
      message="Are you sure you want to remove this link? This action cannot be undone."
      @cancel="isModalOpen = false"
      @confirm="executeDelete"
    />
  </div>
</template>

<style scoped>
.animate-pulse-once {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
