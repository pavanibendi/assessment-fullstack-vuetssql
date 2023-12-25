<script setup lang="ts">
import { loginSchema, LoginSchemaType } from "@mono/validation/lib/auth";
import { useAuthStore } from "@/store/auth";
definePageMeta({
  middleware: "auth-redirect",
});
const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();
const router = useRouter();
const { fetchUser } = useAuthStore();

const { mutate, isLoading } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.auth.login.mutate(v as LoginSchemaType),
  onSuccess: async () => {
    await fetchUser();
    router.push({ name: "dashboard" });
  },
  onError: (error) => {
    console.error("🚀 ~ mutation ~ error", error);
  },
});
</script>

<template>
  <MContainer title="Login">
    <MForm
      :zodSchema="loginSchema"
      @submit="mutate"
    >
      <div>
        <MTextField
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
      <div class="flex justify-between">
        <div>
          <MCheckbox
            :modelValue="true"
            name="rememberMe"
            label="Remember Me"
            class="my-2"
          ></MCheckbox>
        </div>
        <div>
          <BtnLink
            variant="text"
            color="gray"
            size="sm"
            :to="{ name: 'password-resetrequest' }"
          >
            Reset Password
          </BtnLink>
        </div>
      </div>
      <MRow>
        <MBtn
          color="primary"
          size="lg"
          class="mx-auto mt-4 w-1/2"
          type="submit"
          :loading="isLoading"
        >
          Login
        </MBtn>
      </MRow>
    </MForm>
    <MRow>
      <BtnLink
        variant="text"
        color="gray"
        class="mx-auto mt-8 w-1/2"
        :to="{ name: 'register' }"
      >
        Create Account
      </BtnLink>
    </MRow>
  </MContainer>
</template>
