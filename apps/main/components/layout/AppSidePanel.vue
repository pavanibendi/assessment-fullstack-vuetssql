<script setup lang="ts">
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
// eslint-disable-next-line vue/no-setup-props-destructure
const { modelValue } = defineProps<{
  modelValue: boolean;
}>();
// computed value
const value = computed({
  get: () => modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <MSidePanel
    v-model="value"
    mobileOnly
  >
    <template #sidepanel></template>
    <slot></slot>
  </MSidePanel>
</template>
