export const useRefreshKey = () => {
  const refreshKeyRandomPrefix = Math.random().toString(36).substring(7);
  const refreshKeyCounter = ref(0);
  const refreshKey = computed(() => {
    return `${refreshKeyRandomPrefix}-${refreshKeyCounter.value}`;
  });
  const refresh = () => {
    refreshKeyCounter.value++;
  };
  return { refreshKey, refresh };
};
