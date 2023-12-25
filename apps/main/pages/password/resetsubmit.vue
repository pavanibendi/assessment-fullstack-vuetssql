<script setup lang="ts">
import {
  passwordResetSubmitSchema,
  PasswordResetSubmitSchemaType,
} from "@mono/validation/lib/auth";
const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();
const router = useRouter();
const route = useRoute();

const email = computed(() => route.query.email as string);
const { mutate, isLoading } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.auth.passwordResetSubmit.mutate(
      v as PasswordResetSubmitSchemaType
    ),
  onSuccess: () => {
    router.push({
      name: "index",
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
      :zodSchema="passwordResetSubmitSchema"
      @submit="mutate"
    >
      <div>
        <MTextField
          :modelValue="email"
          name="email"
          label="Email"
          class="my-2"
          disabled
        ></MTextField>
        <MTextField
          name="token"
          label="Token"
          type="password"
          class="my-2"
        ></MTextField>
        <MPasswordField
          name="newPassword"
          label="New Password"
          class="my-2"
        >
        </MPasswordField>
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
