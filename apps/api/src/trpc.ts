import { initTRPC, TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { type createContext } from "./context";
import { type MyJwtPayload } from "./trpc/auth";
import { getCookie, clearCookie } from "./functions/cookies";
import { EnvConfig } from "./env.config";
const t = initTRPC.context<typeof createContext>().create();

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;
export const trpcError = TRPCError;

// user procedure
const isUser = middleware(({ ctx: { req, res }, next }) => {
  // get user accessToken cookie and verify it
  const accessToken = getCookie({ req, name: "accessToken" });
  if (accessToken === undefined) {
    throw new trpcError({
      code: "UNAUTHORIZED",
    });
  }
  let payload: MyJwtPayload;
  try {
    payload = jwt.verify(
      accessToken,
      EnvConfig.JWT_SECRET as string
    ) as MyJwtPayload;
  } catch (error) {
    clearCookie({
      res,
      name: "accessToken",
    });
    throw new trpcError({
      code: "UNAUTHORIZED",
    });
  }
  const { userId } = payload;
  return next({
    ctx: {
      user: { userId },
    },
  });
});
export const protectedProcedure = publicProcedure.use(isUser);
