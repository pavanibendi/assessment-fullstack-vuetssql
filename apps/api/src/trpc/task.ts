import { router, protectedProcedure, trpcError } from "../trpc";
import { db, schema } from "../db";
import { uuid } from "drizzle-orm";

export const tasks = router({
  createTask: protectedProcedure
    .input(schema.task)
    .mutation(async ({ input }) => {
      const newTask = await db.insert(schema.task).values(input);
      if (!newTask) {
        throw new trpcError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new task.",
        });
      }
      return newTask;
    }),

  getTaskById: protectedProcedure
    .query(async ({ input }) => {
      const { id } = input;
      const task = await db.query.task.findFirst({
        where: { id },
      });
      if (!task) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Task not found.",
        });
      }
      return task;
    }),

  updateTask: protectedProcedure
    .input(schema.task)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      const updatedTask = await db.update(schema.task).set(updateData).where(uuid("id").eq(id)).one();
      if (!updatedTask) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Task not found for updating.",
        });
      }
      return updatedTask;
    }),

  deleteTask: protectedProcedure
    .input(uuid("id"))
    .mutation(async ({ input }) => {
      const { id } = input;
      const deletedTask = await db.delete(schema.task).where(uuid("id").eq(id)).one();
      if (!deletedTask) {
        throw new trpcError({
          code: "NOT_FOUND",
          message: "Task not found for deletion.",
        });
      }
      return {
        success: true,
      };
    }),

  listTasks: protectedProcedure.query(async () => {
    const tasksList = await db.query.task.findMany();
    return tasksList;
  }),
});
