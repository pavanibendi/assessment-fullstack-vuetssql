<script setup lang="ts">
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { modelValue, items } = defineProps<{
  modelValue?: string;
  items: {
    label: string;
    value: string;
    tooltip?: string;
  }[];
}>();

const nonFirstClasses = "ltr:-ml-px rtl:-mr-px";
</script>

<template>
  <span class="isolate inline-flex rounded-md shadow-sm">
    <button
      v-for="(item, index) in items"
      :key="item.value"
      type="button"
      class="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-xs font-medium text-gray-700 first-of-type:rounded-l-md last-of-type:rounded-r-md hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1"
      :class="{
        [nonFirstClasses]: index > 0,
        'border-primary-500 ring-primary-500': item.value === modelValue,
      }"
      @click="emit('update:modelValue', item.value)"
    >
      <span class="sr-only">
        {{ item.tooltip || item.label }}
      </span>
      {{ item.label }}
    </button>
  </span>
</template>
