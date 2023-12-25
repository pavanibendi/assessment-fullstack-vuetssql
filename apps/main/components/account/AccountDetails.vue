<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
const authStore = useAuthStore();
</script>

<template>
  <MCard title="Account Details">
    <MRow>
      <div class="mt-4 basis-full px-4 sm:basis-1/2">
        <dt class="text-sm font-medium text-gray-500">Full name</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {{ authStore.user?.name }}
        </dd>
      </div>
      <div class="mt-4 basis-full px-4 sm:basis-1/2">
        <dt class="text-sm font-medium text-gray-500">Email address</dt>
        <dd class="mt-1 text-sm text-gray-900">
          {{ authStore.user?.email }}
        </dd>
      </div>
    </MRow>
    <template #actions>
      <MBtn
        variant="text"
        color="error"
        @click="authStore.logout"
      >
        Logout
      </MBtn>
    </template>
  </MCard>
</template>
