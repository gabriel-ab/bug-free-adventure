import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserInfo: protectedProcedure
    .input(
      z.object({
        id: z.string().email(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user
        .findUniqueOrThrow({
          where: {
            id: input?.id,
          },
        })
        .catch((err) => {
          if (err instanceof Prisma.NotFoundError) {
            throw new TRPCError({
              message:
                "The email you provided was not found among the list of enrolled USN emails. Please contact Boban",
              code: "NOT_FOUND",
            });
          } else
            throw new TRPCError({
              message: "Internal Server Error",
              code: "INTERNAL_SERVER_ERROR",
            });
        });
    }),
  getLoggedInUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  setNameForUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: { name: input.name },
      });
    }),
});