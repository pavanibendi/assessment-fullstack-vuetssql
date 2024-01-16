<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSnackStore } from "@/store/snackbar";

const snackStore = useSnackStore();
const { show, message, color } = storeToRefs(snackStore);
</script>

<template>
  <MSnackbar
    v-model="show"
    :message="message"
    :color="color"
  />
</template>
