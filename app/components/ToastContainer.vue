<script setup>
const toastStore = useToastStore();
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="px-4 py-3 rounded shadow-xl text-sm font-medium min-w-[220px] flex justify-between items-center cursor-pointer bg-slate-900 backdrop-blur-md transition-all duration-300"
        :class="{
          'text-emerald-400 border border-emerald-500/30':
            toast.type === 'success',
          'text-red-400 border border-red-500/30': toast.type === 'error',
        }"
        @click="toastStore.remove(toast.id)"
      >
        <div class="flex items-center gap-2">
          <span>{{ toast.message }}</span>
        </div>
        <span class="ml-3 text-[10px] opacity-50 font-bold">✕</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
