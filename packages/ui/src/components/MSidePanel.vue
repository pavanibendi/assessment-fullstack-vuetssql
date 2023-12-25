<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
// eslint-disable-next-line vue/no-setup-props-destructure
const { modelValue, mobileOnly = false } = defineProps<{
  modelValue: boolean;
  mobileOnly?: boolean;
}>();
</script>

<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-100">
    <body class="h-full">
    ```
  -->
  <div>
    <TransitionRoot
      as="template"
      :show="modelValue"
    >
      <Dialog
        as="div"
        class="relative z-40 md:hidden"
        @close="emit('update:modelValue', false)"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel
              class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-100"
            >
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div class="absolute right-0 top-0 -mr-12 pt-2">
                  <button
                    type="button"
                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-1 focus:ring-inset focus:ring-white"
                    @click="emit('update:modelValue', false)"
                  >
                    <span class="sr-only">Close Sidepanel</span>
                    <XMarkIcon
                      class="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div class="scrollbar-hidden overflow-y-auto">
                <div class="flex min-h-0 flex-1 flex-col border-x bg-gray-100">
                  <slot name="sidepanel"></slot>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
          <div
            class="w-14 flex-shrink-0"
            aria-hidden="true"
          >
            <!-- Dummy element to force sidepanel to shrink to fit close icon -->
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidepanel for desktop -->
    <div
      v-if="!mobileOnly"
      class="scrollbar-hidden hidden overflow-y-auto md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col"
    >
      <!-- Sidepanel component, swap this element with another sidepanel if you like -->
      <div class="flex min-h-0 flex-1 flex-col border-x bg-gray-100">
        <slot name="sidepanel"></slot>
      </div>
    </div>
    <div
      class="flex flex-col"
      :class="{ 'md:pl-64': !mobileOnly }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
.scrollbar-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
