<script setup lang="ts">
const router = useRouter();
const emit = defineEmits<{
  (e: "toggle:sidepanel", value: boolean): void;
}>();
</script>

<template>
  <MAppbar @toggle:sidepanel="emit('toggle:sidepanel', true)">
    <div
      class="cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-primary-700 to-secondary-700 px-6 py-2 text-xl font-bold text-white hover:text-white"
      @click="
        router.push({
          name: 'index',
        })
      "
    >
      My App
    </div>
  </MAppbar>
</template>
