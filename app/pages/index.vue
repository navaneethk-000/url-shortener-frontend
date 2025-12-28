<script setup>
definePageMeta({
  middleware: ["auth"]
})

const longUrl = ref('')
const customAlias = ref('')
const result = ref(null) 
const errorMsg = ref('')
const myLinks = ref([]) 

const config = useRuntimeConfig()
const { token } = useAuth()

const aliasError = computed(() => {
  if (customAlias.value.length > 10) return "Enter an alias with less than 10 characters"
  return ""
})

const fetchMyLinks = async () => {
  if (!token.value) return
  try {
    const { data } = await useFetch(`${config.public.apiBase}/api/user/urls`, {
      headers: { Authorization: `Bearer ${token.value}` },
      key: 'user-urls',
      lazy: true
    })
    if (data.value) myLinks.value = data.value
    watch(data, (newVal) => { if (newVal) myLinks.value = newVal })
  } catch (e) {
    console.error("Failed to fetch links")
  }
}

watch(token, (newToken) => {
  if (newToken) fetchMyLinks()
}, { immediate: true })

const shortenUrl = async () => {
  errorMsg.value = ''
  result.value = null
  if (aliasError.value) return 

  try {
    const { data, error } = await useFetch(`${config.public.apiBase}/api/shorten`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: {
        original_url: longUrl.value,
        custom_alias: customAlias.value || undefined
      }
    })

    if (error.value) {
      errorMsg.value = error.value.data?.error || 'Failed to shorten URL'
      return
    }
    result.value = data.value
    if (data.value) {
      if (!myLinks.value) myLinks.value = []
      myLinks.value.unshift(data.value)
    }
    longUrl.value = ''
    customAlias.value = ''
  } catch (e) {
    errorMsg.value = "Network Connection Error"
  }
}

const deleteLink = async (shortCode) => {
  if (!confirm("Are you sure you want to delete this link?")) return
  try {
    const { error } = await useFetch(`${config.public.apiBase}/api/shorten/${shortCode}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (error.value) {
      alert(error.value.data?.error || "Failed to delete")
      return
    }
    myLinks.value = myLinks.value.filter(link => link.short_code !== shortCode)
  } catch (e) {
    alert("Network Error")
  }
}

const shortLink = computed(() => result.value ? `${config.public.apiBase.replace(/\/$/, '')}/${result.value.short_code}` : '')
const qrLink = computed(() => result.value ? `${config.public.apiBase.replace(/\/$/, '')}/api/qr/${result.value.short_code}` : '')
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8">
    
    <!-- Shortener Card -->
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">Shorten Your Link</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
          <input v-model="longUrl" type="url" placeholder="https://super-long-url.com/..." class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-3" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Custom Alias (Optional)</label>
          <div class="flex">
            <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">/</span>
            <input v-model="customAlias" type="text" placeholder="my-link" :class="{'border-red-500 focus:border-red-500 focus:ring-red-500': aliasError}" class="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 border p-3" />
          </div>
          <p v-if="aliasError" class="mt-1 text-sm text-red-600">{{ aliasError }}</p>
        </div>

        <button @click="shortenUrl" :disabled="!longUrl || !!aliasError" class="w-full bg-indigo-600 text-white p-3 rounded-md font-bold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
          Shorten URL
        </button>
      </div>

      <div v-if="errorMsg" class="mt-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-center">{{ errorMsg }}</div>

      <div v-if="result" class="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 text-center animate-pulse-once">
        <p class="text-green-800 font-medium mb-2">🎉 URL Shortened!</p>
        <a :href="shortLink" target="_blank" class="text-2xl font-bold text-indigo-600 hover:underline break-all block">{{ shortLink }}</a>
        <div class="mt-6 flex flex-col items-center">
          <p class="text-sm text-gray-500 mb-2">Scan QR Code</p>
          <img :src="qrLink" alt="QR Code" class="w-32 h-32 border-4 border-white shadow-sm" />
        </div>
        <div class="mt-6">
          <NuxtLink :to="`/stats/${result.short_code}`" class="text-sm font-semibold text-gray-600 hover:text-indigo-600">📊 View Analytics</NuxtLink>
        </div>
      </div>
    </div>

    <!-- My Links List -->
    <div v-if="token && myLinks && myLinks.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 class="text-lg font-bold text-gray-700">My Links</h3>
        <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded border">{{ myLinks.length }} Total</span>
      </div>
      
      <ul class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
        <li v-for="link in myLinks" :key="link.id" class="px-6 py-4 hover:bg-gray-50 transition group">
          <div class="flex justify-between items-center">
            
            <div class="flex-1 min-w-0 pr-4">
              <a :href="`${config.public.apiBase}/${link.short_code}`" target="_blank" class="text-indigo-600 font-bold hover:underline text-lg">/{{ link.short_code }}</a>
              <p class="text-xs text-gray-500 truncate" :title="link.original_url">{{ link.original_url }}</p>
            </div>

            <div class="flex items-center space-x-3">
              <div class="text-right hidden sm:block mr-2">
                <span class="block text-xs font-bold text-gray-700">{{ link.total_clicks }}</span>
                <span class="block text-[10px] text-gray-400 uppercase">Clicks</span>
              </div>
              <NuxtLink :to="`/stats/${link.short_code}`" class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"><span class="text-xl">📊</span></NuxtLink>
              <button @click="deleteLink(link.short_code)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"><span class="text-xl">🗑️</span></button>
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