<script setup>
import ToastContainer from "../components/ToastContainer.vue";

const authStore = useAuthStore();
const isMenuOpen = ref(false);

// Ensures Pinia reads the cookie and restores the user on refresh
onMounted(() => {
  authStore.initAuth();
});

const initial = computed(() => authStore.userInitial);

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);

const handleLogout = () => {
  isMenuOpen.value = false;
  authStore.logout();
};
</script>

<template>
  <div
    class="hide-scrollbar min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-indigo-500 selection:text-white relative overflow-x-hidden"
    @click="isMenuOpen = false"
  >
    <!-- NAVBAR -->
    <nav
      class="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl transition-all duration-300"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <!-- Logo Section -->
          <NuxtLink to="/" class="flex items-center gap-2 sm:gap-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101 m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <span
              class="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400"
            >
              GoShortener
            </span>
          </NuxtLink>

          <!-- UNIFIED ACTIONS AREA (Visible on all screens) -->
          <div class="flex items-center gap-3 sm:gap-4">
            <template v-if="authStore.token">
              <div class="relative" @click.stop>
                <!-- Avatar Button -->
                <button
                  @click="toggleMenu"
                  class="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-indigo-400 font-bold text-sm hover:bg-slate-700 transition-colors shadow-lg"
                >
                  {{ initial }}
                </button>

                <!-- Profile Dropdown -->
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 scale-95 -translate-y-2"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                >
                  <div
                    v-if="isMenuOpen"
                    class="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 border border-white/10 z-50"
                  >
                    <div class="px-5 py-4 border-b border-white/5">
                      <p
                        class="text-[10px] uppercase text-indigo-400 font-bold tracking-widest"
                      >
                        Signed in as
                      </p>
                      <p class="text-sm font-bold text-white truncate mt-1">
                        {{ authStore.user?.name || "User" }}
                      </p>
                      <p class="text-xs text-slate-400 truncate font-mono">
                        {{ authStore.user?.email }}
                      </p>
                    </div>

                    <div class="p-2 space-y-1">
                      <NuxtLink
                        to="/"
                        class="flex items-center px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <svg
                          class="w-4 h-4 mr-3 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </NuxtLink>
                      <button
                        @click="handleLogout"
                        class="w-full flex items-center px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg
                          class="w-4 h-4 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </template>

            <!-- GUEST VIEW -->
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-xs sm:text-sm text-slate-400 hover:text-white font-medium"
              >
                Log in
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:scale-105 transition-transform"
              >
                Sign Up
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <ToastContainer />

    <main
      class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-12"
    >
      <slot />
    </main>
  </div>
</template>
