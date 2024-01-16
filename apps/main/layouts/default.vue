<script setup lang="ts">
const sidepanelOpen = ref(false);
</script>

<template>
  <div>
    <div class="h-full">
      <AppSidePanel v-model="sidepanelOpen">
        <AppHeader @toggle:sidepanel="sidepanelOpen = !sidepanelOpen" />
        <main>
          <slot />
        </main>
      </AppSidePanel>
      <AppSnackbar />
    </div>
  </div>
</template>
