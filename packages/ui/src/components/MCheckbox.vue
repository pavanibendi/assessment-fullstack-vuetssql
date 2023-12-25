<script setup lang="ts">
import {  watch } from "vue";
import { useField } from "vee-validate";
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const {
  modelValue = false,
  name,
  label,
  description,
} = defineProps<{
  modelValue?: boolean;
  name: string;
  label: string;
  description?: string;
}>();
// assign id as field name with random suffix
const id = name + Math.random().toString(36).substr(2, 9);

const { errorMessage, meta, value } = useField(name, undefined, {
  initialValue: modelValue,
  syncVModel: true,
});
watch(
  value,
  (v) => {
    emit("update:modelValue", v);
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex h-5 items-center">
      <input
        :id="id"
        v-model="value"
        :aria-describedby="description ? `${id}-description` : undefined"
        :name="name"
        type="checkbox"
        class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        :class="{
          'border-error-300 text-error-600': errorMessage && meta.touched,
        }"
      />
    </div>
    <div class="ml-3 text-sm rtl:mr-3">
      <label
        :for="id"
        class="font-medium text-gray-700"
      >
        {{ label }}
      </label>
      <p
        v-if="description && !errorMessage && !meta.touched"
        :id="`${id}-description`"
        class="text-gray-500"
      >
        {{ description }}
      </p>
      <p
        v-if="errorMessage && meta.touched"
        :id="`${id}-error`"
        class="text-sm text-error-600"
      >
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
