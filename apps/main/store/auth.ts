import { defineStore } from "pinia";
import type { RouterOutput } from "@/composables/useTrpcClient";

const trpcClient = useTrpcClient();

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const user = ref<null | RouterOutput["account"]["me"]>(null);
  const isLoggedIn = computed(() => !!user.value);

  const fetchUser = async () => {
    try {
      const userDetails = await trpcClient.account.me.query();
      user.value = userDetails;
    } catch (error) {
      console.error("🚀 ~ fetchUser ~ error", error);
    }
  };
  const logout = async () => {
    try {
      await trpcClient.account.logout.mutate();
      user.value = null;
      router.push({
        name: "index",
      });
    } catch (error) {
      console.error("🚀 ~ logout ~ error", error);
    }
  };
  const clearUser = () => {
    user.value = null;
    router.push({
      name: "index",
    });
  };

  return {
    user,
    isLoggedIn,
    fetchUser,
    logout,
    clearUser,
  };
});
