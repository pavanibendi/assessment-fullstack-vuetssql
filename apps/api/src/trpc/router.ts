import { router } from "../trpc";

import { auth } from "./auth";
import { account } from "./account";

export const appRouter = router({
  auth,
  // protected
  account,
});

export type AppRouter = typeof appRouter;
