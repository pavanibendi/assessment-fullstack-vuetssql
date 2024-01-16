<script setup lang="ts">
import { Bars3Icon } from "@heroicons/vue/24/outline";
const emit = defineEmits<{
  (e: "toggle:sidepanel"): void;
}>();
</script>

<template>
  <div class="border-b border-gray-200 bg-gray-50 px-4 py-1.5">
    <div class="flex h-12 items-center">
      <div class="md:hidden">
        <button
          type="button"
          class="-ml-3 inline-flex h-12 w-12 flex-shrink items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
          @click="emit('toggle:sidepanel')"
        >
          <span class="sr-only">Open Sidepanel</span>
          <Bars3Icon
            class="h-6 w-6"
            aria-hidden="true"
          />
        </button>
      </div>
      <div class="flex w-full items-center">
        <slot> </slot>
      </div>
    </div>
  </div>
</template>
