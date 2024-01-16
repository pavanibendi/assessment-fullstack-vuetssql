<script setup lang="ts">
import { computed, type ConcreteComponent } from "vue";
import type { RouteLocationNamedRaw } from "vue-router";
import { StarIcon } from "@heroicons/vue/20/solid";
import { RouterLink } from "vue-router";

const sizeClasses = {
  xs: "px-2.5 py-1.5 text-xs rounded",
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-md",
  lg: "px-4 py-2 text-base rounded-md",
  xl: "px-6 py-3 text-base rounded-md",
};
const iconSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
};

const variantClasses = {
  primary: {
    primary:
      "bg-primary-600 text-white enabled:hover:bg-primary-700 focus:ring-primary-500",
    secondary:
      "bg-secondary-600 text-white enabled:hover:bg-secondary-700 focus:ring-secondary-500",
    error:
      "bg-error-600 text-white enabled:hover:bg-error-700 focus:ring-error-500",
    gray: "bg-gray-600 text-white enabled:hover:bg-gray-700 focus:ring-gray-500",
  },
  secondary: {
    primary:
      "bg-primary-100 text-primary-700 enabled:hover:bg-primary-200 focus:ring-primary-500",
    secondary:
      "bg-secondary-100 text-secondary-700 enabled:hover:bg-secondary-200 focus:ring-secondary-500",
    error:
      "bg-error-100 text-error-700 enabled:hover:bg-error-200 focus:ring-error-500",
    gray: "bg-gray-100 text-gray-700 enabled:hover:bg-gray-200 focus:ring-gray-500",
  },
  text: {
    primary:
      "text-primary-600 enabled:hover:bg-primary-50 focus:ring-primary-500",
    secondary:
      "text-secondary-600 enabled:hover:bg-secondary-50 focus:ring-secondary-500",
    error: "text-error-600 enabled:hover:bg-error-50 focus:ring-error-500",
    gray: "text-gray-600 enabled:hover:bg-gray-50 focus:ring-gray-500",
  },
};

const {
  variant = "primary",
  size = "md",
  color = "primary",
  type = "button",
  to,
  disabled = false,
  loading = false,
  LinkComponent = RouterLink,
} = defineProps<{
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  color?: keyof typeof variantClasses.primary;
  type?: "button" | "submit";
  to?: RouteLocationNamedRaw;
  disabled?: boolean;
  loading?: boolean;
  // eslint-disable-next-line vue/prop-name-casing
  LinkComponent?: ConcreteComponent;
}>();

const disabledComputed = computed(() => (disabled || loading) as boolean);

const baseClasses =
  "inline-flex items-center border border-transparent font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-inset";
const opacityClass = computed(() => (disabled ? "opacity-50" : "opacity-100"));
const sizeClass = sizeClasses[size];
const variantColorClass = variantClasses[variant][color];
const iconSizeClass = iconSizeClasses[size];

const classes = computed(() => [
  sizeClass,
  variantColorClass,
  baseClasses,
  opacityClass.value,
]);
</script>

<template>
  <component
    :is="LinkComponent"
    v-if="to"
    :to="to"
    :class="classes"
    :disabled="disabledComputed"
  >
    <span class="mx-auto inline-flex">
      <slot />
    </span>
  </component>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabledComputed"
  >
    <span class="mx-auto inline-flex">
      <slot v-if="!loading" />
      <span
        v-else
        class="w-12"
      >
        <StarIcon
          class="mx-auto animate-spin text-white"
          :class="iconSizeClass"
        />
      </span>
    </span>
  </button>
</template>
