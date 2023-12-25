<script setup lang="ts">
definePageMeta({
  middleware: "auth-guard",
});
</script>

<template>
  <MRow>
    <div class="mx-auto mt-12 basis-1/2">
      <DashboardTabs />
    </div>
    <div class="basis-full">
      <NuxtPage />
    </div>
  </MRow>
</template>
