<script setup lang="ts">
import {
  passwordResetRequestSchema,
  PasswordResetRequestSchemaType,
} from "@mono/validation/lib/auth";
const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();
const router = useRouter();
const email = ref("");

const { mutate, isLoading } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.auth.passwordResetRequest.mutate(
      v as PasswordResetRequestSchemaType
    ),
  onSuccess: () => {
    router.push({
      name: "password-resetsubmit",
      query: {
        email: email.value,
      },
    });
  },
  onError: (error) => {
    console.error("🚀 ~ mutation ~ error", error);
  },
});
</script>

<template>
  <MContainer title="Password Reset">
    <MForm
      :zodSchema="passwordResetRequestSchema"
      @submit="mutate"
    >
      <div>
        <MTextField
          v-model="email"
          name="email"
          label="Email"
          class="my-2"
        ></MTextField>
      </div>
      <MRow>
        <MBtn
          color="primary"
          size="lg"
          class="mx-auto mt-4 w-1/2"
          type="submit"
          :loading="isLoading"
        >
          Submit
        </MBtn>
      </MRow>
    </MForm>
  </MContainer>
</template>
