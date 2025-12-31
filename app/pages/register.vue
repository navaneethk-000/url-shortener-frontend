<script setup>
const authStore = useAuthStore();
const toastStore = useToastStore();

const name = ref("");
const email = ref("");
const password = ref("");
const errorMsg = ref("");

const handleRegister = async () => {
  errorMsg.value = "";
  try {
    await authStore.register(name.value, email.value, password.value);
    toastStore.success("Account created successfully!");

    navigateTo("/login");
  } catch (err) {
    errorMsg.value = err.data?.error || "Registration failed";
    toastStore.error(errorMsg.value);
  }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="relative bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl shadow-black/50 transition-all w-[500px]"
    >
      <!-- Header -->
      <h1
        class="text-3xl font-extrabold mb-2 text-center text-white tracking-tight"
      >
        Create Account
      </h1>
      <p class="text-center text-slate-400 text-sm mb-8">
        Join us to get started
      </p>

      <!-- Registration Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5"
            >Full Name</label
          >
          <input
            v-model="name"
            type="text"
            required
            placeholder="John Doe"
            class="block w-full rounded-lg border border-slate-700 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm p-2.5 transition-colors"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5"
            >Email</label
          >
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="block w-full rounded-lg border border-slate-700 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm p-2.5 transition-colors"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="block w-full rounded-lg border border-slate-700 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm p-2.5 transition-colors"
          />
        </div>

        <!-- Error Message -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="errorMsg"
            class="rounded-md bg-red-500/10 border border-red-500/20 p-3 flex items-center justify-center"
          >
            <svg
              class="h-4 w-4 text-red-400 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-red-400 font-medium">{{ errorMsg }}</p>
          </div>
        </transition>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full flex justify-center py-2.5 px-4 rounded-lg shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-50 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-200"
        >
          Sign Up
        </button>
      </form>

      <!-- Login Link -->
      <div class="mt-6 text-center text-sm text-slate-400">
        Already have an account?
        <NuxtLink
          to="/login"
          class="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200 underline decoration-indigo-500/30 underline-offset-4 hover:decoration-indigo-400"
        >
          Log in
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
