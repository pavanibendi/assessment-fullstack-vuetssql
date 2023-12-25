<script setup lang="ts">
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { ZodObject, ZodRawShape } from "zod";

const emit = defineEmits<{
  (e: "submit", values: unknown): void;
  (e: "update:valid", valid: boolean): void;
}>();

const { zodSchema } = defineProps<{
  zodSchema: ZodObject<ZodRawShape>;
}>();

const validationSchema = toFormValidator(zodSchema);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const valid = ref(false);
watch(errors, () => {
  valid.value = Object.keys(errors.value).length === 0;
  emit("update:valid", valid.value);
});

const onSubmit = handleSubmit(
  (values) => {
    emit("submit", values);
  },
  ({ values, errors }) => {
    console.error("Form Submission Error", {
      values,
      errors,
    });
  },
);
</script>

<template>
  <form @submit.prevent="onSubmit">
    <slot />
    <slot
      name="actions"
      :valid="valid"
    ></slot>
  </form>
</template>
