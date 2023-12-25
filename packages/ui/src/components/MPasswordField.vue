<script setup lang="ts">
import { ref } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/20/solid";
import MTextField from "./MTextField.vue";
import MBtnIcon from "./MBtnIcon.vue";

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const { label, name, modelValue } = defineProps<{
  label: string;
  name: string;
  modelValue?: string;
}>();

const showPassword = ref(false);
</script>

<template>
  <MTextField
    :modelValue="modelValue"
    :name="name"
    :type="showPassword ? 'text' : 'password'"
    :label="label"
    @update:modelValue="(v) => emit('update:modelValue', v)"
  >
    <template #appendInner>
      <MBtnIcon
        size="xs"
        tooltip="Show Password"
        @click="showPassword = !showPassword"
      >
        <EyeIcon v-if="showPassword" />
        <EyeSlashIcon v-else />
      </MBtnIcon>
    </template>
  </MTextField>
</template>
