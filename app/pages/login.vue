<script setup>
definePageMeta({
  middleware: ["guest"],
});

const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMsg = ref("");
const isSuccess = ref(false);

const handleLogin = async () => {
  errorMsg.value = "";
  try {
    // Handles the API call, saves the token to cookies, and decodes user info
    await authStore.login(email.value, password.value);

    isSuccess.value = true;
    setTimeout(() => navigateTo("/"), 800);
  } catch (err) {
    // Handle specific error messages from the API
    errorMsg.value = err.data?.error || "Invalid email or password";
  }
};
</script>

<template>
  <div class="flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <!-- Card -->
    <div
      class="relative w-full max-w-md sm:max-w-lg lg:max-w-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl shadow-black/80"
    >
      <div class="mb-8 sm:mb-10 text-center">
        <div
          class="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10"
        >
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome Back
        </h1>
        <p class="text-slate-400 mt-2 text-sm sm:text-base">
          Enter your credentials to access your dashboard.
        </p>
      </div>

      <!-- Login Form -->
      <form
        v-if="!isSuccess"
        @submit.prevent="handleLogin"
        class="space-y-5 sm:space-y-6"
      >
        <!-- Email -->
        <div class="group">
          <label
            class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1"
          >
            Email Address
          </label>
          <div class="relative focus-within:scale-[1.01] transition-all">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9"
                />
              </svg>
            </div>
            <input
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
              class="w-full rounded-xl border border-slate-700/50 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 pl-10 py-3 sm:py-3.5 text-sm sm:text-base transition-all shadow-inner"
            />
          </div>
        </div>

        <!-- Password -->
        <div class="group">
          <label
            class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1"
          >
            Password
          </label>
          <div class="relative focus-within:scale-[1.01] transition-all">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                class="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              v-model="password"
              type="password"
              required
              placeholder="password"
              class="w-full rounded-xl border border-slate-700/50 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-900 pl-10 py-3 sm:py-3.5 text-sm sm:text-base transition-all shadow-inner"
            />
          </div>
        </div>

        <!-- Error -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="errorMsg"
            class="flex items-start rounded-lg bg-red-500/10 border border-red-500/20 p-4"
          >
            <p class="text-sm text-red-400 font-medium">{{ errorMsg }}</p>
          </div>
        </transition>

        <!-- Submit -->
        <button
          type="submit"
          class="relative w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/30 transition-all"
        >
          Sign In
        </button>

        <!-- Footer -->
        <p class="text-center text-slate-500 text-sm pt-3">
          Don’t have an account?
          <NuxtLink
            to="/register"
            class="font-semibold text-indigo-400 hover:text-white transition-colors"
          >
            Create one now
          </NuxtLink>
        </p>
      </form>

      <!-- Success -->
      <div v-else class="text-center py-8 sm:py-12">
        <h3 class="text-xl sm:text-2xl font-bold text-green-600 mb-2">
          Access Granted
        </h3>
        <p class="text-slate-400 text-sm">Redirecting to your dashboard...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}
</style>
