<script setup lang="ts">
import { type ConcreteComponent } from "vue";

const emit = defineEmits<{
  (e: "item:click", value: string): void;
}>();

type ListItem = {
  text: string;
  value: string;
  icon?: ConcreteComponent;
  count?: string;
};

const { item, active } = defineProps<{
  item: ListItem;
  active?: boolean;
}>();
</script>

<template>
  <div
    :class="[
      active
        ? 'bg-gray-200 text-gray-900'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
      'flex items-center rounded-md px-3 py-2 text-sm font-medium',
    ]"
    class="cursor-pointer"
    @click="emit('item:click', item.value)"
  >
    <component
      :is="item.icon"
      v-if="item.icon"
      :class="[
        active ? 'text-gray-500' : 'text-gray-400',
        '-ml-1 mr-3 h-6 w-6 flex-shrink-0',
      ]"
      aria-hidden="true"
    />
    <span class="truncate">{{ item.text }}</span>
    <span
      v-if="item.count"
      :class="[
        active ? 'bg-gray-50' : 'bg-gray-200 text-gray-600',
        'ml-auto inline-block rounded-full px-3 py-0.5 text-xs',
      ]"
      >{{ item.count }}</span
    >
  </div>
</template>
