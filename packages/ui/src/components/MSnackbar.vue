<script setup lang="ts">
import { computed, watch } from "vue";
import { XMarkIcon } from "@heroicons/vue/20/solid";
import MBtnIcon from "../components/MBtnIcon.vue";

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const bgColors = {
  success: "bg-success-50",
  error: "bg-error-50",
};
const textColors = {
  success: "text-success-700",
  error: "text-error-700",
};

const {
  modelValue = false,
  message,
  color,
} = defineProps<{
  modelValue: boolean;
  message: string;
  color: keyof typeof bgColors;
}>();

const bgClass = computed(() => bgColors[color]);
const textClass = computed(() => textColors[color]);

const show = computed({
  get: () => modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(show, (value) => {
  if (value) {
    setTimeout(() => {
      show.value = false;
    }, 3000);
  }
});
</script>

<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
  >
    <div
      class="mt-auto flex w-full flex-col items-center space-y-4 sm:items-start"
    >
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <transition
        enterActiveClass="transform ease-out duration-300 transition"
        enterFromClass="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterToClass="translate-y-0 opacity-100 sm:translate-x-0"
        leaveActiveClass="transition ease-in duration-100"
        leaveFromClass="opacity-100"
        leaveToClass="opacity-0"
      >
        <div
          v-if="show"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
          :class="[bgClass]"
        >
          <div class="px-4 py-2">
            <div class="flex items-center">
              <div class="flex w-0 flex-1 justify-between">
                <p
                  class="w-0 flex-1 text-sm font-medium"
                  :class="[textClass]"
                >
                  {{ message }}
                </p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <MBtnIcon
                  tooltip="Close"
                  variant="text"
                  @click="show = false"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon
                    class="h-5 w-5"
                    aria-hidden="true"
                  />
                </MBtnIcon>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
