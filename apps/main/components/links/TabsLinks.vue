<script lang="ts">
import type { ConcreteComponent, PropType } from "vue";
import type { RoutesNamedLocations } from "@typed-router";
import MTabs from "@mono/ui/src/components/MTabs.vue";
const NuxtLink = resolveComponent("NuxtLink") as ConcreteComponent;
export default defineComponent({
  extends: MTabs,
  props: {
    tabs: {
      type: Array as PropType<{ name: string; to: RoutesNamedLocations }[]>,
      required: true,
    },
  },
  setup() {
    return {
      NuxtLink,
    };
  },
});
</script>

<template>
  <MTabs
    v-bind="$props"
    :LinkComponent="NuxtLink"
  >
  </MTabs>
</template>
