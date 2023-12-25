<script setup lang="ts">
import { computed } from "vue";

const colorClasses = {
  white: "hover:bg-gray-50 focus:bg-gray-100",
  black: "hover:bg-gray-700 focus:bg-gray-600",
};

const activeClasses = {
  white: "bg-gray-100 text-gray-800",
  black: "bg-gray-700 text-gray-100",
};

const inactiveClasses = {
  white: "bg-gray-50 text-gray-800",
  black: "bg-gray-800 text-gray-100",
};

const {
  color = "white",
  tooltip,
  active = false,
  href,
} = defineProps<{
  color?: keyof typeof colorClasses;
  tooltip: string;
  active?: boolean;
  href?: string;
}>();

const el = computed(() => (href ? "a" : "button"));

const classes = computed(() => {
  const colorClass = colorClasses[color];
  const activeClass = activeClasses[color];
  const inactiveClass = inactiveClasses[color];
  return {
    [colorClass]: true,
    [activeClass]: active,
    [inactiveClass]: !active,
  };
});
</script>

<template>
  <component
    :is="el"
    :type="el === 'button' ? 'button' : undefined"
    :target="el === 'a' ? '_blank' : undefined"
    :href="href"
    class="relative inline-flex items-center px-4 py-2 focus:z-20 focus:outline-none"
    :class="classes"
  >
    <span class="sr-only">
      {{ tooltip }}
    </span>
    <span
      class="h-5 w-5"
      aria-hidden="true"
    >
      <slot> </slot>
    </span>
  </component>
</template>
