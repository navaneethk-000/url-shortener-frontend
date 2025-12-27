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
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md transition-all">
    <h1 class="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
    
    <form v-if="!isSuccess" @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="email" type="email" required class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="password" type="password" required class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>

      <p v-if="errorMsg" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{{ errorMsg }}</p>

      <button type="submit" class="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        Log In
      </button>
    </form>

    <div v-else class="text-center py-10">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Login Successful</h3>
      <p class="text-gray-500">Redirecting to dashboard...</p>
    </div>
  </div>
</template> 