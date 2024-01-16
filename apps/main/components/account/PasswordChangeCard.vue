<script setup lang="ts">
import {
  passwordChangeSchema,
  type PasswordChangeSchemaType,
} from "@mono/validation/lib/account";
const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();

const { refresh } = defineProps<{
  refresh: () => void;
}>();

const { mutate, isPending } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.account.passwordChange.mutate(v as PasswordChangeSchemaType),
  onSuccess: () => {
    refresh();
  },
  onError: (error) => {
    console.error("🚀 ~ mutation ~ error", error);
  },
});
</script>

<template>
  <MCard title="Change Password">
    <MForm
      :zodSchema="passwordChangeSchema"
      @submit="mutate"
    >
      <div>
        <MPasswordField
          name="password"
          label="Current Password"
        >
        </MPasswordField>
      </div>
      <div>
        <MPasswordField
          name="newPassword"
          label="New Password"
        >
        </MPasswordField>
      </div>
      <template #actions="{ valid }">
        <div class="text-end">
          <MBtn
            type="submit"
            color="primary"
            :disabled="!valid"
            :loading="isPending"
          >
            Change Password
          </MBtn>
        </div>
      </template>
    </MForm>
  </MCard>
</template>
