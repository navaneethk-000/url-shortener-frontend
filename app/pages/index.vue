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
    <div class="relative group">
      <!-- Ambient Glow behind the card -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

      <div class="relative bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl">
        <h2 class="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">
          Shorten Your Link
        </h2>

        <div class="space-y-6">
          <!-- Long URL Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Long URL</label>
            <div class="relative">
              <input 
                v-model="longUrl" 
                type="url" 
                placeholder="https://super-long-url.com/..." 
                class="block w-full rounded-lg border border-slate-700 bg-slate-950/50 text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 sm:text-sm p-3 shadow-inner transition-colors" 
              />
            </div>
          </div>

          <!-- Custom Alias Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Custom Alias <span class="text-slate-500 text-xs font-normal">(Optional)</span></label>
            <div class="flex shadow-sm rounded-lg">
              <span class="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-700 bg-slate-800 text-slate-400 text-sm font-mono">
                /
              </span>
              <input 
                v-model="customAlias" 
                type="text" 
                placeholder="my-link" 
                :class="{'border-red-500/50 focus:border-red-500 focus:ring-red-500': aliasError, 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500': !aliasError}"
                class="flex-1 block w-full rounded-r-lg bg-slate-950/50 text-slate-200 placeholder-slate-500 border focus:ring-1 sm:text-sm p-3 transition-colors" 
              />
            </div>
            <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0">
              <p v-if="aliasError" class="mt-2 text-sm text-red-400 flex items-center">
                <span class="mr-1">⚠</span> {{ aliasError }}
              </p>
            </transition>
          </div>

          <!-- Action Button -->
          <button 
            @click="shortenUrl" 
            :disabled="!longUrl || !!aliasError" 
            class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white p-3.5 rounded-lg font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform active:scale-[0.98]"
          >
            Shorten URL
          </button>
        </div>

        <!-- Global Error Message -->
        <transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100">
          <div v-if="errorMsg" class="mt-6 p-4 bg-red-500/10 text-red-300 rounded-lg border border-red-500/20 text-center text-sm font-medium">
            {{ errorMsg }}
          </div>
        </transition>

        <!-- Success Result -->
        <transition enter-active-class="transition ease-out duration-500" enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0">
          <div v-if="result" class="mt-8 relative overflow-hidden bg-slate-800/50 rounded-xl border border-indigo-500/30">
            <!-- Decorative top shimmer -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70"></div>
            
            <div class="p-6 text-center">
              <p class="text-green-400 font-semibold mb-3 flex items-center justify-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> URL Shortened!
              </p>
              
              <a :href="shortLink" target="_blank" class="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-300 hover:to-cyan-300 break-all block transition-all mb-6">
                {{ shortLink }}
              </a>

              <div class="flex flex-col items-center justify-center bg-white/5 rounded-lg p-6 w-fit mx-auto backdrop-blur-sm border border-white/5">
                <p class="text-xs text-slate-400 uppercase tracking-wider mb-3">Scan QR Code</p>
                <!-- Added white padding to QR code to ensure it's scannable in dark mode -->
                <div class="bg-white p-2 rounded-lg">
                  <img :src="qrLink" alt="QR Code" class="w-32 h-32" />
                </div>
              </div>

              <div class="mt-6">
                <NuxtLink :to="`/stats/${result.short_code}`" class="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors group/link">
                  <span>View Analytics</span>
                  <svg class="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- My Links List -->
    <div v-if="token && myLinks && myLinks.length > 0" class="bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden">
      
      <!-- List Header -->
      <div class="px-6 py-4 border-b border-white/5 bg-slate-950/30 flex justify-between items-center backdrop-blur-sm">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          My Links
        </h3>
        <span class="text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
          {{ myLinks.length }} Total
        </span>
      </div>
      
      <!-- List Items -->
      <ul class="divide-y divide-white/5 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <li v-for="link in myLinks" :key="link.id" class="px-6 py-5 hover:bg-white/[0.02] transition duration-150 group">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            <!-- Link Info -->
            <div class="flex-1 min-w-0 pr-4">
              <div class="flex items-center gap-2">
                <span class="text-slate-500 text-lg">/</span>
                <a :href="`${config.public.apiBase}/${link.short_code}`" target="_blank" class="text-indigo-400 font-bold hover:text-indigo-300 hover:underline text-lg transition-colors">
                  {{ link.short_code }}
                </a>
              </div>
              <p class="text-xs text-slate-500 truncate mt-1 group-hover:text-slate-400 transition-colors" :title="link.original_url">
                {{ link.original_url }}
              </p>
            </div>

            <!-- Stats & Actions -->
            <div class="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
              
              <!-- Click Counter -->
              <div class="text-right rounded-full flex flex-col justify-center items-center mr-4 bg-slate-950 px-3 py-1 rounded border border-white/5">
                <span class="block text-sm font-bold text-white">{{ link.total_clicks }}</span>
                <span class="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Clicks</span>
              </div>

              <div class="flex items-center space-x-1">
                <NuxtLink 
                  :to="`/stats/${link.short_code}`" 
                  class="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                  title="View Analytics"
                >
                  <span class="text-lg filter drop-shadow-lg">📊</span>
                </NuxtLink>
                
                <button 
                  @click="deleteLink(link.short_code)" 
                  class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Delete Link"
                >
                  <span class="text-lg filter drop-shadow-lg">🗑️</span>
                </button>
              </div>

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