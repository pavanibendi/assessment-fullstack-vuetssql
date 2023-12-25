import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn) {
    console.debug(
      "🚀 ~ defineNuxtRouteMiddleware ~ authStore.isLoggedIn",
      authStore.isLoggedIn
    );
    return navigateTo({
      name: "index",
    });
  }
  return true;
});
