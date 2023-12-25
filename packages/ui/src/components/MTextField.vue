<script setup lang="ts">
import { useField } from "vee-validate";

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const {
  name,
  modelValue,
  label,
  disabled = false,
  placeholder = "",
  type = "text",
} = defineProps<{
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number";
  modelValue?: string | null;
  disabled?: boolean;
  placeholder?: string;
}>();

// assign id as field name with random suffix
const id = name + Math.random().toString(36).substr(2, 9);

const { errorMessage, meta, value } = useField(name, undefined, {
  initialValue: modelValue,
  syncVModel: true,
});
</script>

<template>
  <div class="mb-3">
    <label
      :for="id"
      class="block px-1 text-start text-xs font-light"
      :class="{
        'text-error-700': errorMessage && meta.touched,
        'text-gray-700': !errorMessage,
      }"
    >
      {{ label }}
    </label>
    <div class="relative mt-1 rounded-md shadow-sm">
      <input
        :id="id"
        v-model="value"
        :name="label"
        :type="type"
        :disabled="disabled"
        class="block w-full rounded-md p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-200 disabled:text-gray-500 sm:text-sm"
        :class="{
          'border-error-300 text-error-900': errorMessage && meta.touched,
          'border-gray-300 text-gray-900': !errorMessage,
          'pr-10': !!$slots.appendInner,
        }"
        :placeholder="label || placeholder"
        @input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value as string)"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="appendInner"></slot>
      </div>
    </div>
  </div>
</template>
