<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// eslint-disable-next-line vue/no-setup-props-destructure
const {
  modelValue = false,
  title,
  persistent = false,
} = defineProps<{
  modelValue?: boolean;
  title?: string;
  persistent?: boolean;
}>();

const open = ref(modelValue);
watch(open, (value) => {
  emit("update:modelValue", value);
});
watch(
  () => modelValue,
  (value) => {
    open.value = value;
  }
);

const handleClose = () => {
  if (!persistent) {
    open.value = false;
  }
};
</script>

<template>
  <div v-if="$slots.activator">
    <slot
      name="activator"
      :on="{
        click: () => {
          open = true;
        },
      }"
    />
  </div>
  <TransitionRoot
    as="template"
    :show="open"
  >
    <Dialog
      as="div"
      class="relative z-10"
      @close="handleClose"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center sm:items-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
            >
              <div>
                <div
                  v-if="title"
                  class="bg-gray-200 p-6"
                >
                  <DialogTitle
                    as="h3"
                    class="text-xl font-medium leading-6 text-gray-900"
                  >
                    {{ title }}
                  </DialogTitle>
                </div>
                <slot> </slot>
              </div>
              <div
                v-if="$slots.actions"
                class="m-4 grid grid-flow-col-dense justify-end gap-4"
              >
                <slot name="actions"> </slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
