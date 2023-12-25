<script setup lang="ts">
import {
  emailChangeVerifySchema,
  EmailChangeVerifySchemaType,
} from "@mono/validation/lib/account";
import { useAuthStore } from "@/store/auth";
const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();
const { fetchUser } = useAuthStore();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { modelValue } = defineProps<{
  modelValue: boolean;
}>();

const { mutate, isLoading } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.account.emailChangeVerify.mutate(
      v as EmailChangeVerifySchemaType,
    ),
  onSuccess: () => {
    fetchUser();
    emit("update:modelValue", false);
  },
  onError: (error) => {
    console.error("🚀 ~ onError ~ error", error);
  },
});
</script>

<template>
  <MDialog
    :modelValue="modelValue"
    title="Verify Your Email"
    persistent
    @update:modelValue="(v) => emit('update:modelValue', v)"
  >
    <MForm
      :zodSchema="emailChangeVerifySchema"
      @submit="mutate"
    >
      <div>
        <MTextField
          name="otpCode"
          label="OTP Code"
          type="text"
        />
      </div>
      <div
        class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
      >
        <MBtn
          type="submit"
          color="primary"
          class="inline-flex w-full sm:col-start-2"
          :loading="isLoading"
        >
          Verify
        </MBtn>
        <MBtn
          type="button"
          variant="text"
          color="gray"
          class="inline-flex w-full sm:col-start-1"
          @click="emit('update:modelValue', false)"
        >
          Cancel
        </MBtn>
      </div>
    </MForm>
  </MDialog>
</template>
