<script setup lang="ts">
import type { RoutesNamedLocations } from "@typed-router";
const tabs = [
  {
    name: "Websites",
    to: { name: "dashboard" },
  },
  { name: "Account", to: { name: "dashboard-account" } },
] satisfies { name: string; to: RoutesNamedLocations }[];
</script>

<template>
  <TabsLinks :tabs="tabs"></TabsLinks>
</template>
