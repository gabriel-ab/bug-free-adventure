import { PrismaClient, User } from "@prisma/client";
import { toJson } from "really-relaxed-json";
import { reMapLearnerActivityUtil } from "../../bff/learnerActivityUtil";
import {
  learnerActivitySchema,
  LearnerAnalyticsAPIResponse,
} from "../../schema/LearnerActivitySchema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const STUDENT_GROUP = "NorwaySpring2024A";

export const learnerActivity = async (prisma: PrismaClient, user: User) => {
  const externalAPIURL = `http://adapt2.sis.pitt.edu/aggregate2/GetContentLevels?usr=${user.protusId}&grp=${STUDENT_GROUP}&mod=user&sid=TEST&cid=352&lastActivityId=while_loops.j_digits&res=-1`;

  const unfilteredAPI = await fetch(externalAPIURL)
    .then((response) => response.text())
    .then((text) => toJson(text))
    .then((j) => JSON.parse(j));

  const activityResources = await prisma.activityResource.findMany({
    select: {
      id: true,
      name: true,
      url: true,
      relation: {
        select: {
          description: true,
          moduleName: true,
        },
      },
    },
  });

  const api = reMapLearnerActivityUtil(
    unfilteredAPI,
    activityResources
  ) as LearnerAnalyticsAPIResponse;

  return learnerActivitySchema.parse(api);
};

export const learnerActivityRouter = createTRPCRouter({
  getLearnerActivity: protectedProcedure.query(async ({ ctx }) => {
    const externalAPIURL = `http://adapt2.sis.pitt.edu/aggregate2/GetContentLevels?usr=${ctx.session.user.protusId}&grp=${STUDENT_GROUP}&mod=user&sid=TEST&cid=352&lastActivityId=while_loops.j_digits&res=-1`;

    const unfilteredAPI = await fetch(externalAPIURL)
      .then((response) => response.text())
      .then((text) => toJson(text))
      .then((j) => JSON.parse(j));

    const activityResources = await ctx.prisma.activityResource.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        relation: {
          select: {
            description: true,
            moduleName: true,
          },
        },
      },
    });

    const api = reMapLearnerActivityUtil(
      unfilteredAPI,
      activityResources
    ) as LearnerAnalyticsAPIResponse;

    return learnerActivitySchema.parse(api);
  }),
});
