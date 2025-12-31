<script setup>
defineProps({
  isOpen: Boolean,
  title: String,
  message: String,
});

const emit = defineEmits(["confirm", "cancel"]);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div
      class="bg-gray-900 rounded-lg shadow-xl shadow-gray-800 border border-gray-600 p-6 w-full max-w-sm transform transition-all"
    >
      <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-200 text-md mb-6">{{ message }}</p>

      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
