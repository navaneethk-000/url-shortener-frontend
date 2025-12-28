<script setup>
const { token, user, logout } = useAuth()
const isMenuOpen = ref(false) 

const initial = computed(() => {
  return user.value?.email ? user.value.email.charAt(0).toUpperCase() : 'U'
})

const toggleMenu = () => isMenuOpen.value = !isMenuOpen.value

const handleLogout = () => {
  isMenuOpen.value = false
  logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-sans text-gray-900" @click="isMenuOpen = false">
    
    <nav class="bg-white shadow relative z-50">
      <div class="max-w-4xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-indigo-600 flex items-center">
              🔗 GoShortener
            </NuxtLink>
          </div>
          
          <div class="flex items-center space-x-4">
            
            <!-- Logged in view -->
            <template v-if="token">
              <div class="relative" @click.stop>
                <button @click="toggleMenu" class="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 focus:outline-none transition">
                  {{ initial }}
                </button>

                <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 transform origin-top-right transition-all">
                  <div class="px-4 py-3 border-b border-gray-100">
                    <p class="text-xs text-gray-500 uppercase font-semibold">Signed in as</p>
                    <p class="text-sm font-bold text-gray-900 truncate" :title="user?.email">{{ user?.email }}</p>
                  </div>
                  <div class="py-1">
                    <NuxtLink to="/" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Dashboard</NuxtLink>
                    <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign out</button>
                  </div>
                </div>
              </div>
            </template>
            
            <!-- Guest view -->
            <template v-else>
              <NuxtLink to="/login" class="text-gray-600 hover:text-indigo-600 font-medium text-sm">Login</NuxtLink>
              <NuxtLink to="/register" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition">Sign Up</NuxtLink>
            </template>

          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-4xl mx-auto px-4 py-8 relative z-0">
      <slot />
    </main>
  </div>
</template>