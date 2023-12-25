<script setup lang="ts">
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { PhotoIcon } from "@heroicons/vue/24/solid";

const {
  src,
  srcLazy,
  aspectRatio = 1,
  alt,
  objectFit = "cover",
  objectPosition = "center",
  eager = false,
} = defineProps<{
  src: string;
  srcLazy?: string | null;
  aspectRatio?: number;
  alt?: string;
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
  objectPosition?: string;
  eager?: boolean;
}>();

const srcLoaded = ref(false);
const isError = ref(false);
const onError = () => {
  if (srcLazy) return;
  isError.value = true;
};
// todo: add support for srcset & test for threshold
// intersection logic
const target = ref(null);
const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting) return;
  stop();
  // load image when it is in viewport
  const img = new Image();
  img.src = src;
  img.onload = () => {
    srcLoaded.value = true;
  };
});
</script>

<template>
  <div
    ref="target"
    :style="{ aspectRatio }"
  >
    <div
      v-if="!isError"
      class="relative h-full w-full overflow-hidden"
    >
      <img
        v-if="srcLazy"
        :src="srcLazy"
        class="image-blur pointer-events-none absolute left-0 top-0 h-full w-full object-cover object-center"
      />
      <img
        :src="srcLoaded || eager ? src : undefined"
        :alt="alt"
        :style="{
          objectFit,
          objectPosition,
          aspectRatio,
        }"
        class="absolute left-0 top-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-linear"
        :class="{
          'opacity-100': srcLoaded || eager,
        }"
        @error="onError"
      />
    </div>
    <div
      v-if="isError"
      class="flex h-full items-center justify-center bg-gray-50"
    >
      <div class="text-gray-400">
        <PhotoIcon class="mx-auto h-8 w-8" />
        <div class="text-xs">Not Found</div>
      </div>
    </div>
  </div>
</template>

<style>
.image-blur {
  filter: blur(40);
  /* this is needed so Safari keeps sharp edges */
  transform: scale(1);
}
</style>
