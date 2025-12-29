<script setup>
const name = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const { register } = useAuth()

const handleRegister = async () => {
  errorMsg.value = ''
  try {
    await register(name.value, email.value, password.value)
    alert("Success! Please login.")
    navigateTo('/login')
  } catch (err) {
    errorMsg.value = err.data?.error || "Registration failed"
  }
}
</script>

<template>
  <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6 text-center">Create Account</h1>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
        <label class="block text-sm font-medium text-gray-700">Full Name</label>
        <input v-model="name" type="text" required class="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <input v-model="email" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700">Password</label>
        <input v-model="password" type="password" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2" />
      </div>

      <p v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</p>

      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        Sign Up
      </button>
    </form>

    <div class="mt-4 text-center text-sm">
        Already have an account? <NuxtLink to="/login" class="text-indigo-600 hover:text-indigo-500">Login</NuxtLink>
    </div>
  </div>
</template>