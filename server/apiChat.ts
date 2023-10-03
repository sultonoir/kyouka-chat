/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTRPCRouter, publicProcedure } from "./trpc";
import z from "zod";

export const apiChat = createTRPCRouter({
  createConversation: publicProcedure
    .input(
      z.object({
        receiptId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session?.user?.email as string,
          },
          include: {
            friend: true,
          },
        });
        if (!user) return;

        const friend = user.friend.find(
          (e) => e.friendName === input.receiptId
        );
        if (!friend) {
          await ctx.prisma.friend.create({
            data: {
              friendName: input.receiptId,
              authorId: user.id,
            },
          });
        }

        const findchat = await ctx.prisma.chat.findFirst({
          where: {
            OR: [
              {
                receiver: input.receiptId,
                sender: user.id,
              },
              {
                receiver: user.id,
                sender: input.receiptId,
              },
            ],
          },
        });

        if (findchat) {
          const othermember =
            user.id === findchat.sender ? findchat.receiver : findchat.sender;

          return {
            chatId: findchat.id,
            userId: othermember,
            memberId: user.id,
          };
        } else {
          const chat = await ctx.prisma.chat.create({
            data: {
              sender: user.id,
              receiver: input.receiptId,
            },
          });

          // Buat member dengan memberId yang benar
          await ctx.prisma.member.createMany({
            data: [
              {
                userId: user.id,
                chatId: chat.id, // Sertakan chatId yang sesuai
              },
              {
                userId: input.receiptId,
                chatId: chat.id, // Sertakan chatId yang sesuai
              },
            ],
          });

          const othermember =
            user.id === chat.sender ? chat.receiver : chat.sender;
          return {
            chatId: chat.id,
            userId: othermember,
            memberId: user.id,
          };
        }

        // Buat chat terlebih dahulu
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
  postContent: publicProcedure
    .input(
      z.object({
        body: z.string().optional(),
        id: z.string(),
        file: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session?.user?.email as string,
          },
        });
        const member = await ctx.prisma.member.findFirst({
          where: {
            chatId: input.id,
            userId: user?.id,
          },
        });
        await ctx.prisma.member.update({
          where: {
            id: member?.id,
          },
          data: {
            updatedAt: new Date(),
          },
        });
        await ctx.prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            content: {
              create: {
                body: input.body,
                updatedAt: new Date(),
                chatId: member?.chatId,
                file: input.file,
              },
            },
          },
        });
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
  getUserChat: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          },
        });
        return user;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
  getConversation: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const chat = await ctx.prisma.chat.findUnique({
          where: {
            id: input.id,
          },
          include: {
            member: {
              include: {
                user: true,
              },
            },
            content: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });
        return chat;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
  createChat: publicProcedure
    .input(
      z.object({
        receiptId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: {
            email: ctx.session?.user?.email as string,
          },
          data: {
            friend: {
              create: {
                friendName: input.receiptId,
              },
            },
          },
        });
        if (!user) return;

        // Buat chat terlebih dahulu
        const chat = await ctx.prisma.chat.create({
          data: {
            sender: user.id,
            receiver: input.receiptId,
          },
        });

        // Buat member dengan memberId yang benar
        await ctx.prisma.member.createMany({
          data: [
            {
              userId: user.id,
              chatId: chat.id, // Sertakan chatId yang sesuai
            },
            {
              userId: input.receiptId,
              chatId: chat.id, // Sertakan chatId yang sesuai
            },
          ],
        });

        return chat.id;
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
});
