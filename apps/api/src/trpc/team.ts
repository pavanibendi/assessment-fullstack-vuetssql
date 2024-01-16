import { router, protectedProcedure, trpcError } from "../trpc";
import { db, schema } from "../db";

export const teams = router({
  createTeam: protectedProcedure
    .input(schema.team)
    .mutation(async ({ input }) => {
      const newTeam = await db.insert(schema.team).values(input);
      if (!newTeam) {
        throw new trpcError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new team."
        });
      }
      return newTeam;
    }),

  getTeamById: protectedProcedure
    .query(async ({ input }) => {
      const { teamId } = input;
      const team = await db.query.team.findFirst({
        where: { id: teamId },
      });
      if (!team) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Team not found.",
        });
      }
      return team;
    }),

  updateTeam: protectedProcedure
    .input(schema.team)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const updatedTeam = await db.update(schema.team).set(updateData).where(uuid("id").eq(id)).one();
      if (!updatedTeam) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Team not found for updating.",
        });
      }
      return updatedTeam;
    }),

  deleteTeam: protectedProcedure
    .input(uuid("id"))
    .mutation(async ({ input }) => {
      const { id } = input;
      const deletedTeam = await db.delete(schema.team).where(uuid("id").eq(id)).one();
      if (!deletedTeam) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Team not found for deletion.",
        });
      }
      return {
        success: true,
      };
    }),

  listTeams: protectedProcedure.query(async () => {
    const teamsList = await db.query.team.findMany();
    return teamsList;
  }),
});
