<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const code = route.params.code

const { data, pending, error } = await useFetch(`${config.public.apiBase}/api/stats/${code}`)

const qrLink = computed(() => {
  const base = config.public.apiBase.replace(/\/$/, '')
  return `${base}/api/qr/${code}`
})
</script>

<template>
  <div>
    <NuxtLink to="/" class="text-indigo-600 hover:text-indigo-800 font-medium mb-4 inline-flex items-center">
      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      Back to Dashboard
    </NuxtLink>

    <div v-if="pending" class="text-center py-10 text-gray-500">Loading stats...</div>
    
    <div v-else-if="error" class="bg-red-50 p-4 text-red-700 rounded-md border border-red-200">
      Error: URL not found or server issue.
    </div>

    <div v-else class="space-y-6">
      
      <!-- Stats & QR Code Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <!-- Main Stats -->
        <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md text-center flex flex-col justify-center">
          <h1 class="text-5xl font-extrabold text-indigo-600">{{ data.url_data.total_clicks }}</h1>
          <p class="text-gray-500 uppercase tracking-wide text-sm font-bold mt-1">Total Clicks</p>
          
          <div class="mt-6 border-t pt-4 border-gray-100">
            <p class="text-gray-400 text-xs uppercase font-semibold">Original URL</p>
            <a :href="data.url_data.original_url" target="_blank" class="text-sm text-indigo-500 hover:underline block mt-1 truncate max-w-lg mx-auto" :title="data.url_data.original_url">
              {{ data.url_data.original_url }}
            </a>
          </div>
        </div>

        <!-- QR Code -->
        <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <h3 class="text-sm font-bold text-gray-700 mb-3 uppercase">QR Code</h3>
          <img :src="qrLink" alt="QR Code" class="w-32 h-32 border-4 border-white shadow-sm mb-3" />
          <a :href="qrLink" download="qrcode.png" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition">
            Download
          </a>
        </div>
      </div>

      <!-- History Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-lg font-bold text-gray-700">Recent Activity</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500">
              <tr>
                <th class="px-6 py-3 font-medium">Time</th>
                <th class="px-6 py-3 font-medium">IP Address</th>
                <th class="px-6 py-3 font-medium">Referrer</th>
                <th class="px-6 py-3 font-medium w-1/4">User Agent</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="click in data.analytics" :key="click.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-3 text-gray-600 whitespace-nowrap">
                  {{ new Date(click.clicked_at).toLocaleString() }}
                </td>
                <td class="px-6 py-3 text-gray-800 font-mono text-xs">{{ click.ip_address }}</td>
                <td class="px-6 py-3 text-gray-600">{{ click.referrer || 'Direct' }}</td>
                <td class="px-6 py-3 text-gray-500 text-xs break-all whitespace-normal">
                  {{ click.user_agent }}
                </td>
              </tr>
              <tr v-if="data.analytics.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-400">
                  No clicks yet. Share your link to see data!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>