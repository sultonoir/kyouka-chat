/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextResponse } from "next/server";
import { createTRPCRouter, publicProcedure } from "./trpc";
import z from "zod";
import { TRPCError } from "@trpc/server";
export const apiGroup = createTRPCRouter({
  createGroup: publicProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session?.user?.email as string,
          },
        });
        const group = await ctx.prisma.group.create({
          data: {
            name: input.name,
            description: input.description as string,
            image: input.image,
          },
        });
        await ctx.prisma.member.create({
          data: {
            groupId: group.id,
            userId: user?.id as string,
            role: "admin",
          },
        });
        return NextResponse.json({ message: "ok" }, { status: 200 });
      } catch (error) {
        throw new Error(`error create group ${String(error)}`);
      }
    }),
  cretaeMessage: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        memberId: z.string(),
        content: z.string(),
        file: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.update({
          where: {
            id: input.memberId,
          },
          data: {
            content: {
              create: {
                groupId: input.groupId,
                body: input.content,
                file: input.file,
              },
            },
            updatedAt: new Date(),
          },
        });
        const member = await ctx.prisma.member.findFirst({
          where: {
            userId: user.id,
            groupId: input.groupId,
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
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
  getGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const group = await ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
          },
          include: {
            conten: {
              include: {
                user: true,
              },
            },
            member: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });
        if (!group) {
          throw new Error("");
        } else {
          return group;
        }
      } catch (error: any) {
        throw new Error(error.message);
      }
    }),
  addMember: publicProcedure
    .input(
      z.array(
        z.object({
          groupId: z.string(),
          memberId: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.member.createMany({
          data: input.map((e) => ({
            groupId: e.groupId,
            userId: e.memberId,
          })),
        });
      } catch (error) {}
    }),
  editGroup: publicProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string().optional(),
        name: z.string().optional(),
        desc: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.group.update({
        where: {
          id: input.id,
        },
        data: {
          image: input.image,
          name: input.name,
          description: input.desc,
        },
      });
    }),
  joinGroup: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email as string,
        },
      });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const group = await ctx.prisma.member.findFirst({
        where: {
          groupId: input.groupId,
          userId: user.id,
        },
      });

      if (!group) {
        const member = await ctx.prisma.member.create({
          data: {
            groupId: input.groupId,
            userId: user.id,
          },
        });
        return {
          groupId: member.groupId,
          userId: member.userId,
        };
      } else {
        return {
          groupId: group.groupId,
          userId: group.userId,
        };
      }
    }),
});
