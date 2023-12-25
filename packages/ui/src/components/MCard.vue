<script setup lang="ts">
// eslint-disable-next-line vue/no-setup-props-destructure
const { title, description } = defineProps<{
  title?: string;
  description?: string;
  actionsStart?: boolean;
}>();
</script>

<template>
  <div class="bg-white shadow sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3
        v-if="title"
        class="text-lg font-medium leading-6 text-gray-900"
      >
        {{ title }}
      </h3>
      <div
        v-if="description"
        class="my-2 max-w-xl text-sm text-gray-500"
      >
        {{ description }}
      </div>
      <div
        v-if="$slots.default"
        :class="{
          'mt-4': title || description,
        }"
      >
        <slot></slot>
      </div>
      <div
        v-if="$slots.actions"
        class="mt-5 flex flex-row"
        :class="{
          'justify-end': !actionsStart,
        }"
      >
        <div class="flex-shrink">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
