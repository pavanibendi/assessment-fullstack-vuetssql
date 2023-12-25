<script lang="ts" setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionRoot,
} from "@headlessui/vue";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

const { title, defaultOpen = false } = defineProps<{
  title: string;
  defaultOpen?: boolean;
}>();
</script>

<template>
  <Disclosure
    v-slot="{ open }"
    :defaultOpen="defaultOpen"
  >
    <!-- Use the `open` state to conditionally change the direction of an icon. -->
    <DisclosureButton
      class="flex w-full justify-between border-b border-gray-300 px-4 py-2"
    >
      <span class="text-md font-medium text-gray-900">{{ title }}</span>
      <ChevronRightIcon
        :class="open ? 'rotate-90 transform' : ''"
        class="h-5 w-5 transform transition-transform duration-200 ease-in-out"
      />
    </DisclosureButton>
    <TransitionRoot
      :show="open"
      as="template"
      enter="origin-top transform transition-transform duration-200"
      enterFrom="scale-y-0"
      enterTo="scale-y-100"
      leave="origin-top transform transition-transform duration-200"
      leaveFrom="scale-y-100"
      leaveTo="scale-y-0"
    >
      <DisclosurePanel>
        <div class="border-b border-gray-300">
          <slot> </slot>
        </div>
      </DisclosurePanel>
    </TransitionRoot>
  </Disclosure>
</template>
