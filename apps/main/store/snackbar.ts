import type { Ref } from "vue";
import { defineStore } from "pinia";

type snackColor = Ref<"success" | "error">;

export const useSnackStore = defineStore("snackbar", () => {
  const show = ref(false);
  const message = ref("");
  const color: snackColor = ref("success");
  // create snack object that has two methods:
  // success and error
  const snack = {
    success: (msg = "Success!") => {
      message.value = msg;
      color.value = "success";
      show.value = true;
    },
    error: (msg = "Error!") => {
      message.value = msg;
      color.value = "error";
      show.value = true;
    },
  };
  return {
    message,
    color,
    snack,
    show,
  };
});
