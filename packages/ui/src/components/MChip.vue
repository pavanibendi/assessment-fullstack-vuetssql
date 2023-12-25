<script setup lang="ts">
import { computed } from "vue";
import { MaybeRef } from "@vueuse/core";

const colorClasses = {
  primary: "bg-primary-100 text-primary-800",
  secondary: "bg-secondary-100 text-secondary-800",
  success: "bg-success-100 text-success-800",
  accent: "bg-accent-100 text-accent-800",
  error: "bg-error-100 text-error-800",
  warning: "bg-warning-100 text-warning-800",
  gray: "bg-gray-100 text-gray-800",
};
const sizeClasses = {
  small: "px-2 py-0.5 text-xs",
  medium: "px-2.5 py-0.5 text-sm",
  large: "px-3 py-0.5 text-sm",
};
const dotColorClasses = {
  primary: "bg-primary-400",
  secondary: "bg-secondary-400",
  success: "bg-success-400",
  accent: "bg-accent-400",
  error: "bg-error-400",
  warning: "bg-warning-400",
  gray: "bg-gray-400",
};

// eslint-disable-next-line vue/no-setup-props-destructure
const {
  label,
  loading = false,
  color = "primary",
  size = "medium",
} = defineProps<{
  label: string;
  loading?: MaybeRef<boolean>;
  color?: keyof typeof colorClasses;
  size?: keyof typeof sizeClasses;
}>();

const classes = computed(() => [
  "inline-flex items-center rounded font-medium",
  colorClasses[color],
  sizeClasses[size],
]);

const dotClasses = computed(() => [
  "mr-1.5 h-2 w-2",
  dotColorClasses[color],
  { "animate-pulse": loading },
]);
</script>

<template>
  <span :class="classes">
    <svg
      :class="dotClasses"
      fill="currentColor"
      viewBox="0 0 8 8"
    >
      <circle
        cx="4"
        cy="4"
        r="3"
      />
    </svg>
    {{ label }}
  </span>
</template>
