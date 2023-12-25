<script lang="ts">
import type { ConcreteComponent, PropType } from "vue";
import type { RoutesNamedLocations } from "@typed-router";
import MBtn from "@mono/ui/src/components/MBtn.vue";
const NuxtLink = resolveComponent("NuxtLink") as ConcreteComponent;
export default defineComponent({
  extends: MBtn,
  props: {
    to: {
      type: Object as PropType<RoutesNamedLocations>,
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
  <MBtn
    v-bind="$props"
    :LinkComponent="NuxtLink"
  >
    <slot></slot>
  </MBtn>
</template>
