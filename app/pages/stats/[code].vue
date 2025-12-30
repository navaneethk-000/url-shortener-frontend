<script setup>
definePageMeta({
  middleware: ["auth"]
})

const route = useRoute()
const config = useRuntimeConfig()
const code = route.params.code

const { data, pending, error } = await useFetch(`${config.public.apiBase}/api/stats/${code}`, {
  key: `stats-${code}`,
  lazy: true
})

const qrLink = computed(() => {
  const base = config.public.apiBase.replace(/\/$/, '')
  return `${base}/api/qr/${code}`
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Back Navigation -->
    <NuxtLink to="/" class="group inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium mb-8 transition-all duration-200">
      <div class="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mr-3 group-hover:bg-indigo-500/20 transition-colors">
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </div>
      <span>Back to Dashboard</span>
    </NuxtLink>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-32">
      <div class="relative mx-auto w-16 h-16">
        <div class="absolute inset-0 rounded-full border-4 border-indigo-500/30"></div>
        <div class="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
      </div>
      <p class="text-slate-400 mt-6 font-medium animate-pulse">Loading analytics data...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500/10 p-8 rounded-2xl border border-red-500/20 text-center max-w-lg mx-auto backdrop-blur-sm">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 text-red-400 mb-4">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <p class="font-bold text-red-400 text-lg mb-1">Error loading stats</p>
      <p class="text-sm text-red-400/70">The URL might not exist or the server is unreachable.</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      
      <!-- Stats & QR Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Total Clicks Card -->
        <div class="relative group md:col-span-2">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div class="relative h-full bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-xl flex flex-col justify-center text-center overflow-hidden">
            
            <!-- Background Decoration -->
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <h1 class="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight">
              {{ data.url_data.total_clicks }}
            </h1>
            <p class="text-indigo-400 uppercase tracking-widest text-xs font-bold mt-2">Total Clicks</p>
            
            <div class="mt-10 border-t border-white/5 pt-6 w-full relative">
              <p class="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-3">Original Destination</p>
              <div class="flex justify-center">
                 <a :href="data.url_data.original_url" target="_blank" class="text-lg text-indigo-400 hover:text-indigo-300 hover:underline truncate px-4 max-w-full inline-block transition-colors" :title="data.url_data.original_url">
                  {{ data.url_data.original_url }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- QR Code Card -->
        <div class="relative bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center">
          <h3 class="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">QR Code</h3>
          
          <!-- White background wrapper for QR to ensure contrast -->
          <div class="bg-white p-3 rounded-xl shadow-lg shadow-indigo-500/10 mb-6 group cursor-pointer transition-transform hover:scale-105">
            <img :src="qrLink" alt="QR Code" class="w-32 h-32" />
          </div>
          
          <a :href="qrLink" download="qrcode.png" class="group flex items-center space-x-2 text-sm bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg transition-all duration-200 border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-indigo-500/25">
            <svg class="w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span>Download PNG</span>
          </a>
        </div>
      </div>

      <!-- History Table -->
      <div class="bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-y-scroll h-[400px] scrollbar-thin scrollbar-black hide-scrollbar">
        
        <!-- Table Header -->
        <div class="px-6 py-5 border-b border-white/5 bg-slate-950/30 backdrop-blur-sm flex justify-between items-center">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="text-indigo-500">📊</span> Recent Activity
          </h3>
          <span class="text-xs font-semibold text-slate-400 bg-slate-800 border border-white/5 px-2.5 py-1 rounded-full">
            {{ data.analytics.length }} Records
          </span>
        </div>
        
        <!-- Responsive Table Wrapper -->
        <div class="overflow-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
          <table class="min-w-full text-left text-sm overflow-scroll">
            <thead class="bg-slate-950/50 text-slate-400 border-b border-white/5">
              <tr>
                <th class="px-6 py-4 font-semibold whitespace-nowrap">Time</th>
                <th class="px-6 py-4 font-semibold whitespace-nowrap">IP Address</th>
                <th class="px-6 py-4 font-semibold whitespace-nowrap">Referrer</th>
                <th class="px-6 py-4 font-semibold">User Agent</th>
                <th class="px-6 py-4 font-semibold whitespace-nowrap">Location</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 cursor-pointer">
              <tr v-for="click in data.analytics" :key="click.id" class="hover:bg-white/[0.02] transition-colors duration-150">
                <td class="px-6 py-4 text-slate-300 whitespace-nowrap">
                  {{ new Date(click.clicked_at).toLocaleString() }}
                </td>
                <td class="px-6 py-4">
                  <span class="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
                    {{ click.ip_address }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-300">
                  <span v-if="click.referrer" class="inline-flex items-center text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    {{ click.referrer }}
                  </span>
                  <span v-else class="text-slate-600 text-xs italic flex items-center">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Direct
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-500 text-xs break-all whitespace-normal leading-relaxed max-w-xs">
                  {{ click.user_agent }}
                </td>
                <td class="px-6 py-4 text-slate-500">
                  <span v-if="click.country && click.country !== 'Unknown'" class="flex items-center gap-2">
                     <!-- You can add a flag icon here later -->
                   {{ click.city ? click.city + ',':''}}{{ click.country }}
                     </span>
                   <span v-else class="text-gray-400">-</span>
                 </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="data.analytics.length === 0">
                <td colspan="5" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                       <span class="text-3xl">📉</span>
                    </div>
                    <p class="text-lg font-medium text-white mb-1">No clicks yet</p>
                    <p class="text-sm text-slate-500">Share your link to start tracking data!</p>
                  </div>
                </td>
              </tr>
            </tbody>  
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  /* Hide scrollbar but allow scrolling */
.hide-scrollbar {
  -ms-overflow-style: none;  
  scrollbar-width: none;     
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;       
}

</style>