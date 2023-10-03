import { appRouter } from "@/server";
import prisma from "@/lib/prisma";

export const serverClient = appRouter.createCaller({
  session: null,
  prisma: prisma,
});
