import { router, protectedProcedure, trpcError } from "../trpc";
import { db, schema } from "../db";
import { uuid } from "drizzle-orm";

export const teamMembers = router({
  createTeamMember: protectedProcedure
    .input(schema.teamMember)
    .mutation(async ({ input }) => {
      const newTeamMember = await db.insert(schema.teamMember).values(input);
      if (!newTeamMember) {
        throw new trpcError({
          code: "INTERNAL_ERROR",
          message: "Failed to create a new team member.",
        });
      }
      return newTeamMember;
    }),

  getTeamMemberById: protectedProcedure
    .query(async ({ input }) => {
      const { id } = input;
      const teamMember = await db.query.teamMember.findFirst({
        where: { id },
      });
      if (!teamMember) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Team member not found.",
        });
      }
      return teamMember;
    }),

  updateTeamMember: protectedProcedure
    .input(schema.teamMember)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const updatedTeamMember = await db.update(schema.teamMember).set(updateData).where(uuid("id").eq(id)).one();
      if (!updatedTeamMember) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Team member not found for updating.",
        });
      }
      return updatedTeamMember;
    }),

  deleteTeamMember: protectedProcedure
    .input(uuid("id"))
    .mutation(async ({ input }) => {
      const { id } = input;
      const deletedTeamMember = await db.delete(schema.teamMember).where(uuid("id").eq(id)).one();
      if (!deletedTeamMember) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Team member not found for deletion.",
        });
      }
      return {
        success: true,
      };
    }),

  listTeamMembers: protectedProcedure.query(async () => {
    const teamMembersList = await db.query.teamMember.findMany();
    return teamMembersList;
  }),
});
