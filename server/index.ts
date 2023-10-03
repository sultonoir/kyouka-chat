import { createTRPCRouter } from "./trpc";
import { apiUser } from "./apiUser";
import { apiGroup } from "./apiGroup";
import { apiChat } from "./apiChat";

export const appRouter = createTRPCRouter({
  user: apiUser,
  grup: apiGroup,
  chat: apiChat,
});

export type AppRouter = typeof appRouter;
