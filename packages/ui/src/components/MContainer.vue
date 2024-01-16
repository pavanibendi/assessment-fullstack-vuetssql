<script setup lang="ts">
const { title } = defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="container mx-auto my-12 max-w-2xl px-2">
    <div
      v-if="title"
      class="mb-8"
    >
      <h1 class="text-center text-4xl font-bold">
        {{ title }}
      </h1>
    </div>
    <slot></slot>
  </div>
</template>
