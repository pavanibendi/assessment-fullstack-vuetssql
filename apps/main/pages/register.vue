<script setup lang="ts">
import {
  registerSchema,
  type RegisterSchemaType,
} from "@mono/validation/lib/auth";

const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();
const router = useRouter();
const email = ref("");

const { mutate, isPending } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.auth.register.mutate(v as RegisterSchemaType),
  onSuccess: () => {
    router.push({
      name: "otp",
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
  <MContainer title="Create Account">
    <MForm
      :zodSchema="registerSchema"
      @submit="mutate"
    >
      <div>
        <MTextField
          name="name"
          label="Name"
          class="my-2"
        ></MTextField>
      </div>
      <div>
        <MTextField
          v-model="email"
          name="email"
          label="Email"
          class="my-2"
        ></MTextField>
      </div>
      <div>
        <MPasswordField
          name="password"
          label="Password"
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
          :loading="isPending"
        >
          Create Account
        </MBtn>
      </MRow>
    </MForm>
    <MRow>
      <BtnLink
        variant="text"
        color="gray"
        class="mx-auto mt-8 w-1/2"
        :to="{ name: 'index' }"
      >
        Login
      </BtnLink>
    </MRow>
  </MContainer>
</template>
