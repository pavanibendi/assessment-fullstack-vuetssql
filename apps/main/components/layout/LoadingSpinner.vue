<script setup lang="ts">
import { StarIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <slot>
    <div class="m-12 flex items-center justify-center">
      <StarIcon class="h-6 w-6 animate-spin" />
    </div>
  </slot>
</template>
