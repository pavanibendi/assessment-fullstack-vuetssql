<script setup lang="ts">
// ICON SIZE HINT: 20 for xs,sm,md and 24 for lg,xl
import { StarIcon } from "@heroicons/vue/20/solid";

const sizeClasses = {
  xs: "p-1",
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2",
  xl: "p-3",
};
const slotSizeClasses = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-6 w-6",
};
const variantClasses = {
  primary: {
    primary:
      "bg-primary-600 hover:bg-primary-700 focus:bg-primary-800 text-white",
    secondary:
      "bg-secondary-600 hover:bg-secondary-700 focus:bg-secondary-800 text-white",
    error: "bg-error-600 hover:bg-error-700 focus:bg-error-800 text-white",
    gray: "bg-gray-600 hover:bg-gray-700 focus:bg-gray-800 text-white",
  },
  outline: {
    primary:
      "text-primary-600 hover:bg-gray-50 focus:bg-gray-100 outline outline-primary-600",
    secondary:
      "text-secondary-600 hover:bg-gray-50 focus:bg-gray-100 outline outline-secondary-600",
    error:
      "text-error-600 hover:bg-gray-50 focus:bg-gray-100 outline outline-error-600",
    gray: "text-gray-600 hover:bg-gray-50 focus:bg-gray-100 outline outline-gray-600",
  },
  text: {
    primary: "text-primary-600 hover:bg-gray-50 focus:bg-gray-100",
    secondary: "text-secondary-600 hover:bg-gray-50 focus:bg-gray-100",
    error: "text-error-600 hover:bg-gray-50 focus:bg-gray-100",
    gray: "text-gray-600 hover:bg-gray-50 focus:bg-gray-100",
  },
};
// eslint-disable-next-line vue/no-setup-props-destructure
const {
  variant = "primary",
  color = "gray",
  size = "md",
  tooltip,
  disabled = false,
  loading = false,
} = defineProps<{
  tooltip: string;
  variant?: keyof typeof variantClasses;
  color?: keyof typeof variantClasses.primary;
  size?: keyof typeof sizeClasses;
  disabled?: boolean;
  loading?: boolean;
}>();

const baseClasses =
  "inline-flex items-center rounded-full border border-transparent p-1 shadow-sm focus:outline-none disabled:opacity-50";
const sizeClass = sizeClasses[size];
const slotSizeClass = slotSizeClasses[size];
const colorClass = variantClasses[variant][color];
const classes = [baseClasses, sizeClass, colorClass];
</script>

<template>
  <button
    type="button"
    :class="classes"
    :disabled="disabled || loading"
  >
    <span class="sr-only">
      {{ tooltip }}
    </span>
    <span :class="slotSizeClass">
      <slot v-if="!loading"></slot>
      <StarIcon
        v-else
        class="animate-spin"
      />
    </span>
  </button>
</template>
