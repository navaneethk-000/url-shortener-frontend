<script setup>
const longUrl = ref('')
const customAlias = ref('')
const result = ref(null) 
const errorMsg = ref('')
const myLinks = ref([])

const config = useRuntimeConfig()
const { token } = useAuth()

// --- Validation Logic ---
const aliasError = computed(() => {
  if (customAlias.value.length > 10) return "Enter an alias with less than 10 characters"
  return ""
})

if (token.value) {
  const { data } = await useFetch(`${config.public.apiBase}/api/user/urls`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })

  if (data.value) {
    myLinks.value = data.value
  } else {
    myLinks.value = []
  }
}

// --- Shorten Action ---
const shortenUrl = async () => {
  // Reset UI states
  errorMsg.value = ''
  result.value = null

  // Auth check
  if (!token.value) {
    navigateTo('/login')
    return
  }

  // Validation check
  if (aliasError.value) return 

  try {
    const { data, error } = await useFetch(`${config.public.apiBase}/api/shorten`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: {
        original_url: longUrl.value,
        custom_alias: customAlias.value || undefined
      }
    })

    if (error.value) {
      errorMsg.value = error.value.data?.error || 'Failed to shorten URL'
      return
    }

    // Success handling
    result.value = data.value
    
    // Update "My Links" list
    if (data.value) {
      if (!myLinks.value) myLinks.value = []
      myLinks.value.unshift(data.value)
    }

  } catch (e) {
    errorMsg.value = "Network Connection Error"
  }
}

const shortLink = computed(() => {
  if (!result.value) return ''
  // Remove trailing slash from base if present to avoid double slashes
  const base = config.public.apiBase.replace(/\/$/, '')
  return `${base}/${result.value.short_code}`
})

const qrLink = computed(() => {
  if (!result.value) return ''
  const base = config.public.apiBase.replace(/\/$/, '')
  return `${base}/api/qr/${result.value.short_code}`
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8">
    
    <!-- Shortener Card -->
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">Shorten Your Link</h2>

      <!-- Input Form -->
      <div class="space-y-4">
        
        <!-- Long URL Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
          <input 
            v-model="longUrl" 
            type="url" 
            placeholder="https://super-long-url.com/..." 
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3"
          />
        </div>

        <!-- Custom Alias Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Custom Alias (Optional)</label>
          <div class="flex">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              /
            </span>
            <input 
              v-model="customAlias" 
              type="text" 
              placeholder="my-link" 
              :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': aliasError}"
              class="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border p-3" 
            />
          </div>
          <!-- Validation Error -->
          <p v-if="aliasError" class="mt-1 text-sm text-red-600">{{ aliasError }}</p>
        </div>

        <!-- Submit Button -->
        <button 
          @click="shortenUrl" 
          :disabled="!longUrl || !!aliasError" 
          class="w-full bg-indigo-600 text-white p-3 rounded-md font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Shorten URL
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-center">
        {{ errorMsg }}
      </div>

      <!-- Result Section -->
      <div v-if="result" class="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 text-center animate-pulse-once">
        <p class="text-green-800 font-medium mb-2">🎉 URL Shortened!</p>
        
        <!-- Short Link -->
        <a :href="shortLink" target="_blank" class="text-2xl font-bold text-indigo-600 hover:underline break-all block">
          {{ shortLink }}
        </a>

        <!-- QR Code -->
        <div class="mt-6 flex flex-col items-center">
          <p class="text-sm text-gray-500 mb-2">Scan QR Code</p>
          <!-- Using the fixed qrLink computed property -->
          <img :src="qrLink" alt="QR Code" class="w-40 h-40 border-4 border-white shadow-sm" />
        </div>

        <!-- Analytics Button -->
        <div class="mt-6">
          <NuxtLink :to="`/stats/${result.short_code}`" class="text-sm font-semibold text-gray-600 hover:text-indigo-600">
            📊 View Analytics
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- My Links Section -->
    <div v-if="token && myLinks && myLinks.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-700">My Links</h3>
        <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Total {{ myLinks.length }}</span>
      </div>
      
      <ul class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        <li v-for="link in myLinks" :key="link.id" class="px-6 py-4 hover:bg-gray-50 transition group">
          <div class="flex justify-between items-center">
            
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-baseline space-x-2">
                <a :href="`${config.public.apiBase}/${link.short_code}`" target="_blank" class="text-indigo-600 font-bold hover:underline text-lg">
                  /{{ link.short_code }}
                </a>
              </div>
              <p class="text-xs text-gray-500 truncate" :title="link.original_url">{{ link.original_url }}</p>
            </div>

            <div class="flex items-center space-x-4">
              <div class="text-right">
                <span class="block text-xs font-bold text-gray-700">{{ link.total_clicks }}</span>
                <span class="block text-[10px] text-gray-400 uppercase">Clicks</span>
              </div>
              
              <NuxtLink :to="`/stats/${link.short_code}`" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition" title="View Analytics">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </NuxtLink>
            </div>

          </div>
        </li>
      </ul>
    </div>

  </div>
</template>


<style scoped>
.animate-pulse-once { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>