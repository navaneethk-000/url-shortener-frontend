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
  // Call the logout action from the store
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
        <div class="flex justify-between h-20 items-center">
          <!-- Logo Section -->
          <div class="flex items-center">
            <NuxtLink to="/" class="group flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
              </div>
              <span
                class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-slate-400 tracking-tight"
              >
                GoShortener
              </span>
            </NuxtLink>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <template v-if="authStore.token">
              <div class="relative" @click.stop>
                <!-- Avatar Button -->
                <button
                  @click="toggleMenu"
                  class="h-10 w-10 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-indigo-400 font-bold text-sm focus:outline-none transition-all duration-200 hover:bg-slate-700 shadow-lg"
                >
                  {{ initial }}
                </button>

                <!-- Dropdown Menu -->
                <transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="transform opacity-0 scale-95 -translate-y-2"
                  enter-to-class="transform opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="transform opacity-100 scale-100 translate-y-0"
                  leave-to-class="transform opacity-0 scale-95 -translate-y-2"
                >
                  <div
                    v-if="isMenuOpen"
                    class="absolute right-0 mt-3 w-64 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl py-2 border border-white/10 z-50"
                  >
                    <!-- User Header -->
                    <div class="px-5 py-4 border-b border-white/5">
                      <p
                        class="text-[10px] text-indigo-400 uppercase font-bold tracking-widest mb-1"
                      >
                        Signed in as
                      </p>
                      <p class="text-sm font-bold text-white truncate">
                        {{ authStore.user?.name || "User" }}
                      </p>
                      <p
                        class="text-xs font-medium text-slate-400 truncate font-mono mt-0.5"
                      >
                        {{ authStore.user?.email }}
                      </p>
                    </div>

                    <div class="p-2 space-y-1">
                      <NuxtLink
                        to="/"
                        class="flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/5 transition-colors group"
                      >
                        <svg
                          class="mr-3 h-5 w-5 text-slate-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                          ></path>
                        </svg>
                        Dashboard
                      </NuxtLink>

                      <button
                        @click="handleLogout"
                        class="w-full flex items-center px-4 py-2.5 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      >
                        <svg
                          class="mr-3 h-5 w-5 text-red-400/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
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
                class="text-slate-400 hover:text-white font-medium text-sm px-4 py-2"
              >
                Log in
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:scale-105 transition-all"
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
      class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12"
    >
      <slot />
    </main>
  </div>
</template>
