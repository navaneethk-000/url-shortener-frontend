<script setup>
const { toasts, remove } = useToast()
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="px-4 py-3 rounded shadow-lg text-sm font-medium min-w-[200px] flex justify-between items-center cursor-pointer"
        :class="{
          'text-green-600 border border-green-600': toast.type === 'success',
          'text-reed-600 border border-red-600': toast.type === 'error'
        }"
        @click="remove(toast.id)"
      >
        <span>{{ toast.message }}</span>
        <span class="ml-3 text-xs opacity-75">✕</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>