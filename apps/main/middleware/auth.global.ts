import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware((route) => {
  const isInDashboard = route.name?.toString().startsWith("dashboard");
  const authStore = useAuthStore();
  if (authStore.isLoggedIn && !isInDashboard) {
    return navigateTo("/dashboard");
  } else if (!authStore.isLoggedIn && isInDashboard) {
    return navigateTo("/");
  }
});
