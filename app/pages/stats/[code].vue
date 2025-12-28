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
  <div>
    <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-800 font-medium mb-6 inline-flex items-center transition">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Back to Dashboard
    </NuxtLink>

    <div v-if="pending" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p class="text-gray-500 mt-4">Loading analytics...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 p-6 text-red-700 rounded-lg border border-red-200 text-center">
      <p class="font-bold">Error loading stats</p>
      <p class="text-sm">The URL might not exist or the server is unreachable.</p>
    </div>

    <div v-else class="space-y-8">
      
      <!-- Stats & QR -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-white p-8 rounded-lg shadow-md text-center flex flex-col justify-center">
          <h1 class="text-6xl font-extrabold text-indigo-600 tracking-tight">{{ data.url_data.total_clicks }}</h1>
          <p class="text-gray-500 uppercase tracking-wide text-sm font-bold mt-2">Total Clicks</p>
          <div class="mt-8 border-t pt-6 border-gray-100 w-full">
            <p class="text-gray-400 text-xs uppercase font-semibold mb-2">Original Destination</p>
            <a :href="data.url_data.original_url" target="_blank" class="text-lg text-indigo-600 hover:underline block truncate px-4" :title="data.url_data.original_url">
              {{ data.url_data.original_url }}
            </a>
          </div>
        </div>

        <div class="bg-white p-8 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h3 class="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">QR Code</h3>
          <img :src="qrLink" alt="QR Code" class="w-40 h-40 border-4 border-white shadow-lg mb-6 rounded-md" />
          <a :href="qrLink" download="qrcode.png" class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full transition flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download PNG
          </a>
        </div>
      </div>

      <!-- History Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-700">Recent Activity</h3>
          <span class="text-xs text-gray-500 bg-white px-2 py-1 rounded border">{{ data.analytics.length }} Records</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="px-6 py-3 font-medium whitespace-nowrap">Time</th>
                <th class="px-6 py-3 font-medium whitespace-nowrap">IP Address</th>
                <th class="px-6 py-3 font-medium whitespace-nowrap">Referrer</th>
                <th class="px-6 py-3 font-medium w-1/3">User Agent</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="click in data.analytics" :key="click.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-3 text-gray-600 whitespace-nowrap">
                  {{ new Date(click.clicked_at).toLocaleString() }}
                </td>
                <td class="px-6 py-3 text-gray-800 font-mono text-xs">{{ click.ip_address }}</td>
                <td class="px-6 py-3 text-gray-600">
                  <span v-if="click.referrer" class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs">{{ click.referrer }}</span>
                  <span v-else class="text-gray-400 italic">Direct</span>
                </td>
                <td class="px-6 py-3 text-gray-500 text-xs break-all whitespace-normal leading-relaxed">
                  {{ click.user_agent }}
                </td>
              </tr>
              <tr v-if="data.analytics.length === 0">
                <td colspan="4" class="px-6 py-12 text-center text-gray-400">
                  <p class="text-lg mb-1">No clicks yet 📉</p>
                  <p class="text-sm">Share your link to start tracking data!</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>