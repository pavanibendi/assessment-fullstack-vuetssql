import { useAuthStore } from "@/store/auth";

export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuthStore();
  await fetchUser();
});
