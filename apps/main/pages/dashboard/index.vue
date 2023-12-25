<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/20/solid";
import { formatTimeAgo } from "@vueuse/core";
const { $useQuery } = useNuxtApp();
const trpcClient = useTrpcClient();
const { isLoading, isFetched, data } = $useQuery({
  queryKey: ["websitesGetAll"],
  queryFn: async () => {
    const data = await trpcClient.website.getAll.query();
    return data;
  },
});
const isEmpty = computed(() => {
  const typedData = data.value as any[];
  return typedData.length === 0;
});
</script>

<template>
  <MContainer title="Your Websites">
    <WebsitesEmpty v-if="isLoading || (isFetched && isEmpty)"></WebsitesEmpty>
    <div v-else>
      <MCard
        v-for="website in data"
        :key="website.id"
        class="mb-4"
      >
        <MRow>
          <div class="my-auto grow">
            <div class="text-xl font-bold">
              {{ website.subdomain }}
            </div>
            <div class="text-sm text-gray-500">
              Last Edit: {{ formatTimeAgo(new Date(website.updatedAt)) }}
            </div>
          </div>
          <div class="my-auto">
            <BtnLink
              :to="{
                name: 'dashboard-websites-websiteId',
                params: {
                  websiteId: website.id,
                },
              }"
              class="ml-2"
            >
              Manage
            </BtnLink>
          </div>
        </MRow>
      </MCard>
      <BtnLink
        :to="{ name: 'dashboard-websites-create' }"
        class="mx-auto"
      >
        <PlusIcon
          class="mr-2 -ml-1 h-5 w-5 rtl:ml-2 rtl:-mr-1"
          aria-hidden="true"
        />
        New Website
      </BtnLink>
    </div>
  </MContainer>
</template>
