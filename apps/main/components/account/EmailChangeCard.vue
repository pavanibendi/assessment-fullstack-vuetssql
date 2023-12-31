<script setup lang="ts">
import {
  emailChangeRequestSchema,
  type EmailChangeRequestSchemaType,
} from "@mono/validation/lib/account";

const { refresh } = defineProps<{
  refresh: () => void;
}>();

const { $useMutation } = useNuxtApp();
const trpcClient = useTrpcClient();

const requestPending = ref(false);
const email = ref("");

const { mutate, isPending } = $useMutation({
  mutationFn: (v: unknown) =>
    trpcClient.account.emailChangeRequest.mutate(
      v as EmailChangeRequestSchemaType,
    ),
  onSuccess: () => {
    requestPending.value = true;
  },
});

watch(requestPending, (value) => {
  if (value === false) {
    refresh();
  }
});
</script>

<template>
  <EmailChangeVerify v-model="requestPending"></EmailChangeVerify>
  <MCard title="Change Email">
    <MForm
      :zodSchema="emailChangeRequestSchema"
      @submit="mutate"
    >
      <div>
        <MTextField
          v-model="email"
          name="email"
          label="New Email"
          type="email"
          :disabled="requestPending === true"
        />
      </div>
      <div>
        <MPasswordField
          name="password"
          label="Password"
          :disabled="requestPending === true"
        />
      </div>
      <template #actions="{ valid }">
        <div class="text-end">
          <MBtn
            type="submit"
            color="primary"
            :disabled="valid === false || requestPending === true"
            :loading="isPending"
          >
            Request Change
          </MBtn>
        </div>
      </template>
    </MForm>
  </MCard>
</template>
