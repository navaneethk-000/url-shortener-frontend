<script setup>
definePageMeta({
  middleware: ["guest"]
})

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isSuccess = ref(false)
const { login } = useAuth()

const handleLogin = async () => {
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    isSuccess.value = true
    setTimeout(() => navigateTo('/'), 800)
  } catch (err) {
    errorMsg.value = "Invalid email or password"
  }
}
</script>

<template>
   <div class="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-2xl shadow-2xl shadow-black/80">
        
        <!-- Header -->
        <div class="mb-10 text-center">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 class="text-3xl font-bold text-white tracking-tight">
            Welcome Back
          </h1>
          <p class="text-slate-400 mt-2 text-sm">
            Enter your credentials to access your dashboard.
          </p>
        </div>
        
        <!-- Login Form -->
        <form v-if="!isSuccess" @submit.prevent="handleLogin" class="space-y-6">
          
          <!-- Email Input -->
          <div class="group">
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div class="relative transition-all duration-300 focus-within:scale-[1.01]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
              </div>
              <input 
                v-model="email" 
                type="email" 
                required 
                class="block w-full rounded-xl border border-slate-700/50 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus:bg-slate-900 sm:text-sm pl-10 py-3.5 transition-all shadow-inner"
                placeholder="someone@gmail.com"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div class="group">
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
            <div class="relative transition-all duration-300 focus-within:scale-[1.01]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <input 
                v-model="password" 
                type="password" 
                required 
                class="block w-full rounded-xl border border-slate-700/50 bg-slate-950/60 text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 focus:bg-slate-900 sm:text-sm pl-10 py-3.5 transition-all shadow-inner"
                placeholder="password"
              />
            </div>
           
          </div>

          <!-- Error Message -->
          <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
            <div v-if="errorMsg" class="rounded-lg bg-red-500/10 border border-red-500/20 p-4 flex items-start">
              <svg class="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-sm text-red-400 font-medium">{{ errorMsg }}</p>
            </div>
          </transition>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-200"
          >
            <span class="absolute right-4 inset-y-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
            Sign In
          </button>

          <!-- Footer Link -->
          <div class="pt-4 text-center">
             <p class="text-slate-500 text-sm">
               Don't have an account? 
               <NuxtLink to="/register" class="font-semibold text-indigo-400 hover:text-white transition-colors">Create one now</NuxtLink>
             </p>
          </div>
        </form>

        <!-- Success State -->
        <div v-else class="text-center py-12">
          <div class="relative mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/10 ring-1 ring-green-500/50 mb-6">
            <div class="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-75"></div>
            <svg class="h-10 w-10 text-green-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-white mb-2 tracking-tight">Access Granted</h3>
          <p class="text-slate-400 text-sm">Redirecting to your dashboard...</p>
          
          <div class="mt-8 w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div class="bg-indigo-500 h-1 rounded-full animate-[loading_1.5s_ease-in-out_infinite] w-1/3"></div>
          </div>
        </div>

      </div>
</template>

<style scoped>
@keyframes loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
</style>