<script setup lang="ts">
import {
  emailVerifySubmitSchema,
  EmailVerifySubmitSchemaType,
} from "@mono/validation/lib/auth";

definePageMeta({
  middleware: "auth-redirect",
});

const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();
const router = useRouter();

const { mutate, isLoading } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.auth.emailVerifySubmit.mutate(v as EmailVerifySubmitSchemaType),
  onSuccess: () => {
    router.push({
      name: "index",
    });
  },
  onError: (error) => {
    console.error("🚀 ~ mutation ~ error", error);
  },
});

const route = useRoute();
const email = computed(() => route.query.email as string);

const newCodeMutation = $useMutation({
  mutationFn: () =>
    trpcClient.auth.emailVerifyRequest.mutate({
      email: email.value,
    }),
  onError: (error) => {
    console.error("🚀 ~ mutation ~ error", error);
  },
});
</script>

<template>
  <MContainer title="Verify Your Email">
    <MForm
      :zodSchema="emailVerifySubmitSchema"
      @submit="mutate"
    >
      <div>
        <MTextField
          name="email"
          label="Email"
          :modelValue="email"
          class="my-2"
          disabled
        ></MTextField>
      </div>
      <div>
        <MTextField
          name="otpCode"
          label="OTP Code"
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
          Verify
        </MBtn>
      </MRow>
    </MForm>
    <MRow class="mt-8">
      <div class="w-1/2 px-2">
        <MBtn
          variant="text"
          class="w-full"
          :loading="newCodeMutation.isLoading.value"
          @click="newCodeMutation.mutate"
        >
          Request New Code
        </MBtn>
      </div>
      <div class="w-1/2 px-2">
        <BtnLink
          variant="text"
          color="gray"
          class="w-full"
          :to="{ name: 'index' }"
        >
          Login
        </BtnLink>
      </div>
    </MRow>
  </MContainer>
</template>
