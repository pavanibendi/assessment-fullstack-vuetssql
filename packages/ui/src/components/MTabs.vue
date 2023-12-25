<script setup lang="ts">
import { useRoute, RouterLink } from "vue-router";
import type { RouteLocationNamedRaw } from "vue-router";
import type { ConcreteComponent } from "vue";
// eslint-disable-next-line vue/no-setup-props-destructure
const { tabs, LinkComponent = RouterLink } = defineProps<{
  tabs: { name: string; to: RouteLocationNamedRaw }[];
  // eslint-disable-next-line
  LinkComponent?: ConcreteComponent;
}>();
const route = useRoute();
const isCurrent = (tab: { name: string; to: RouteLocationNamedRaw }) =>
  tab.to.name === route.name;
</script>

<template>
  <nav
    class="flex space-x-4"
    aria-label="Tabs"
  >
    <component
      :is="LinkComponent"
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.to"
      :class="[
        isCurrent(tab)
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-500 hover:text-gray-700',
        'rounded-md px-3 py-2 text-sm font-medium',
      ]"
      >{{ tab.name }}</component
    >
  </nav>
</template>
