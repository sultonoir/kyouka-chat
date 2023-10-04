/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { publicProcedure, createTRPCRouter, protectedProcedure } from "./trpc";
import z from "zod";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { TRPCError } from "@trpc/server";

const saltRounds = 10;

export const apiUser = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        email: ctx.session?.user?.email as string,
      },
      include: {
        friend: {
          orderBy: {
            friendName: "asc",
          },
        },
        member: {
          include: {
            group: {
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
                },
              },
            },
            chat: {
              include: {
                content: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            user: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
    });
    await ctx.prisma.user.update({
      where: {
        id: user?.id as string,
      },
      data: {
        onlineStatus: true,
        lastSeen: new Date(),
      },
    });
    return user;
  }),
  postRegister: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, username, email, password } = input;
      try {
        const emailUsed = await ctx.prisma.user.findUnique({
          where: {
            email: input.email,
          },
        });
        const usernameExis = await ctx.prisma.user.findUnique({
          where: {
            username,
            email,
          },
        });

        if (usernameExis) {
          throw new Error("Username has been used.");
        }

        if (emailUsed) {
          throw new Error("E-mail has been used.");
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await ctx.prisma.user.create({
          data: {
            name,
            email,
            username,
            hashedPassword,
            profileStatus: "https://github.com/sultonoir",
          },
        });
        await ctx.prisma.member.create({
          data: {
            userId: user.id,
            groupId: "b3ad84a9-a9c8-404e-a052-20715649589d",
          },
        });
        return NextResponse.json({ message: "ok" }, { status: 200 });
      } catch (error) {
        throw new Error(`Error create account, ${String(error)}`);
      }
    }),
  getSearch: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { query } = input;
      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            username: query,
          },
        });
        if (user?.email === (ctx.session?.user?.email as string)) {
          return null;
        } else {
          return user;
        }
      } catch (error) {
        throw new Error(`Error Searching, ${String(error)}`);
      }
    }),
  postLogout: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: {
        email: ctx.session?.user?.email as string,
      },
      data: {
        onlineStatus: false,
      },
    });
    return NextResponse.json({ message: "ok" }, { status: 200 });
  }),
  updateUser: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        username: z
          .string()
          .min(2, {
            message: "username min 2 character",
          })
          .optional(),
        profileStatus: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.user.updateMany({
          where: {
            email: ctx.session?.user?.email as string,
          },
          data: input,
        });
        return NextResponse.json({ message: "ok" }, { status: 200 });
      } catch (error) {
        throw new Error(`Error update user, ${String(error)}`);
      }
    }),
  userUploadImage: publicProcedure
    .input(
      z.object({
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.user.update({
        where: {
          email: ctx.session?.user?.email as string,
        },
        data: {
          image: input.image,
        },
      });
      return NextResponse.json({ message: "ok" }, { status: 200 });
    }),
  userAddFriend: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.user.update({
          where: {
            email: ctx.session?.user?.email as string,
          },
          data: {
            friend: {
              create: {
                friendName: input.username,
              },
            },
          },
        });
        return NextResponse.json({ message: "ok" }, { status: 200 });
      } catch (error: any) {
        throw new Error(`Error add frien, ${String(error.message)}`);
      }
    }),
  getFriends: publicProcedure
    .input(
      z.object({
        friendName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const getFriend = await ctx.prisma.user.findUnique({
          where: {
            id: input.friendName,
          },
          include: {
            friend: {
              orderBy: {
                friendName: "asc",
              },
            },
            member: {
              include: {
                group: {
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
                    },
                  },
                },
                chat: {
                  include: {
                    content: {
                      include: {
                        user: true,
                      },
                    },
                  },
                },
                user: true,
              },
              orderBy: {
                updatedAt: "desc",
              },
            },
          },
        });

        return getFriend;
      } catch (error) {
        throw new Error(`Error get Friend ${String(error)}`);
      }
    }),
  findMany: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { query } = input;
      if (!query) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "no query" });
      }

      const currentUser = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session?.user?.email as string,
        },
      });

      if (!currentUser) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "not login" });
      }

      const user = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              username: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });
      const group = await ctx.prisma.group.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return { user, group };
    }),
});
